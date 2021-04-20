import * as matter from "gray-matter";
import * as handlebars from "handlebars";
import { flat, walk } from "./utils";

const TEST_DIR = "./tests";
const TEST_FILTER = /^.*\.md$/;
const REPO_URL =
    "https://github.com/b1zzu/app-services-guides/tree/test-cases/test-cases";

interface Metadata {
    automation: string[];
    components: string[];
    estimate: string;
    variants: Variant[];
    tags: string[];
}

interface Filter {
    include: string[];
    exclude: string[];
}

interface Filters {
    id?: Filter;
    tags?: Filter;
}

interface Variant {
    [key: string]: string
}

interface RoughTestCase extends CommonFields {
    variants: Variant[];
    roughTitle: string;
    roughContent: string;
}

interface TestCase extends CommonFields {
    title: string;
    content: string;
}

interface CommonFields {
    id: string;
    estimate: number;
    tags: string[];
    file: string;
    url: string;
    matter: matter.GrayMatterFile<string>;
}

function extractTitle(content: string): { title: string; content: string } {
    const lines = content.split("\n");
    while (lines) {
        const line = lines.shift();
        const match = /^\s*#{1}(?!#)\s+(?<title>.*)\s*$/.exec(line);
        if (match) {
            return {
                content: lines.join("\n"),
                title: match.groups.title,
            };
        }
    }

    throw Error("title not found");
}

function extractId(title: string): { id: string; title: string } {
    // A01 - Title
    const match = /^(?<id>[A-Z][0-9]{2})\s-\s(?<title>.*)$/.exec(title);
    if (match) {
        return {
            id: match.groups.id,
            title: match.groups.title,
        };
    } else {
        throw new Error(`can not extract the ID from '${title}'`);
    }
}

/**
 * Convert estimations in format 1h 2h 30m to a float number where 1 = 1h
 */
function convertEstimation(estimate: string): number {
    const p = /^(\d+)([mh])$/.exec(estimate);
    if (p == null) {
        throw new Error(
            `the estimation '${estimate}' is not in the valid format`
        );
    }

    const [_, amount, unit] = p;
    switch (unit) {
        case "m":
            return parseInt(amount, 10) / 60;
        case "h":
            return parseInt(amount, 10);
        default:
            throw new Error(
                `unexpected unit '${unit}' for estimation '${estimate}'`
            );
    }
}

function loadTestCases(testDirectory?: string): TestCase[] {
    return flat(loadRoughTestCases(testDirectory).map(refineTestCase));
}

/**
 * If the test case defines multiple variants then return a test case for each variant
 */
function refineTestCase(test: RoughTestCase): TestCase[] {
    const result: TestCase[] = [];
    for (const variant of test.variants) {
        result.push({
            ...test,
            title: handlebars.compile(test.roughTitle)(variant),
            content: handlebars.compile(test.roughContent)(variant),
        });
    }
    return result;
}

function loadRoughTestCases(testDirectory?: string): RoughTestCase[] {
    return walk(testDirectory || TEST_DIR, TEST_FILTER).map((f) =>
        loadRoughTestCase(f)
    );
}

function loadRoughTestCase(file: string): RoughTestCase {
    const m = matter.read(file);
    const data = m.data as Metadata;

    const te = extractTitle(m.content);
    let title = te.title;
    const content = te.content;

    const ie = extractId(title);
    const id = ie.id;
    title = ie.title;

    return {
        roughContent: content,
        estimate: data.estimate ? convertEstimation(data.estimate) : null,
        file,
        id,
        matter: m,
        variants: data.variants || [{}],
        tags: data.tags || [],
        roughTitle: title,
        url: `${REPO_URL}/${file}`,
    };
}

function stringToFilter(filters: string[]): Filters {
    const r: Filters = {};

    for (const filter of filters) {
        const [n, ff] = filter.split("=");

        r[n] = { include: [], exclude: [] };
        for (const f of ff.split(",")) {
            if (f.startsWith("^")) {
                r[n].exclude.push(f.slice(1));
            } else {
                r[n].include.push(f);
            }
        }
    }

    return r;
}

function filterTests(tests: TestCase[], filters: Filters): TestCase[] {
    return tests.filter((test) => {
        for (const f of Object.keys(filters)) {
            const filter: Filter = filters[f];
            const field: string | string[] = test[f];

            if (filter === undefined) {
                continue;
            }

            if (filter.include !== undefined) {
                for (const include of filter.include) {
                    // exclude tests that don't contain the include condition
                    if (Array.isArray(field)) {
                        if (!field.includes(include)) {
                            return false;
                        }
                    } else {
                        if (field !== include) {
                            return false;
                        }
                    }
                }
            }

            if (filter.exclude !== undefined) {
                for (const exclude of filter.exclude) {
                    // exclude tests that contain the exclude condition
                    if (Array.isArray(field)) {
                        if (field.includes(exclude)) {
                            return false;
                        }
                    } else {
                        if (field === exclude) {
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    });
}

function desiredFileName(test: RoughTestCase): string {
    let name = `${test.id} - ${test.roughTitle}`;

    name = name.toLowerCase();
    name = name.replace(/[^a-z0-9\s]/g, "");
    name = name.replace(/\s+/g, "-");
    name = name.substr(0, 64);
    name = name.replace(/-$/, "");

    return `${name}.md`;
}

export {
    loadTestCases,
    loadRoughTestCases,
    refineTestCase,
    RoughTestCase,
    TestCase,
    filterTests,
    desiredFileName,
    extractId,
    stringToFilter
};
