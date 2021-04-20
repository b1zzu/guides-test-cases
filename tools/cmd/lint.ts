import * as path from "path";
import { CommandModule } from "yargs";
import {
    STEPS_SECTION,
} from "../lib/constants";
import {
    desiredFileName,
    loadRoughTestCases,
    refineTestCase,
    RoughTestCase,
    TestCase,
} from "../lib/test-case";
import { logger } from "../lib/winston";

type Linter<T> = (test: T) => error;

type error = string | null;

const TAGS = /^[a-z][a-z0-9-]+$/;

// Update the test-template.md to
const SECTIONS = [STEPS_SECTION, "Description", "Prerequisites"];

function lintFileNames(): Linter<RoughTestCase> {
    return (test: RoughTestCase): error => {
        const desired = desiredFileName(test);

        const { base: current } = path.parse(test.file);

        if (current !== desired) {
            return `${current} should be renamed to ${desired}`;
        }
        return null;
    };
}

function lintDuplicateIDs(): Linter<RoughTestCase> {
    const parsed: { [id: string]: RoughTestCase } = {};

    return (test: RoughTestCase): error => {
        if (test.id in parsed) {
            return `the id: ${test.id} is duplicated in '${
                parsed[test.id].file
            }' and in '${test.file}'`;
        }
        parsed[test.id] = test;
        return null;
    };
}

function lintTags(): Linter<RoughTestCase> {
    return lintStringArrayField(
        "tags",
        regex(TAGS),
        `valid tags are: ${TAGS}`
    );
}

function regex(reg: RegExp): (f: string) => boolean {
    return (f) => !reg.test(f);
}

function lintStringArrayField<T>(
    field: string,
    l: (f: string) => boolean,
    tip: string
): Linter<T> {
    return (test: T): error => {
        for (const e of test[field]) {
            if (l(e)) {
                return `invalid ${field}: ${e}, ${tip}`;
            }
        }
        return null;
    };
}

function includes(list: string[]): (f: string) => boolean {
    return (f) => !list.includes(f);
}

function lintSections(): Linter<RoughTestCase> {
    return (test: RoughTestCase): error => {
        const sections = [];

        const lines = test.roughContent.split("\n");
        for (const line of lines) {
            const match = /^\s*#{2}(?!#)\s+(?<section>.*)\s*$/.exec(line);
            if (match) {
                sections.push(match.groups.section);
            }
        }

        for (const section of sections) {
            if (!SECTIONS.includes(section)) {
                return `invalid section: ${section}, valid sections are: ${SECTIONS}`;
            }
        }

        if (!sections.includes(STEPS_SECTION)) {
            return `the ${STEPS_SECTION} section is not defined`;
        }

        return null;
    };
}

const roughLinters: { [key: string]: Linter<RoughTestCase> } = {
    "duplicate-ids": lintDuplicateIDs(),
    "file-names": lintFileNames(),
    sections: lintSections(),
    tags: lintTags(),
};

const linters: { [key: string]: Linter<TestCase> } = {};

// tslint:disable:object-literal-sort-keys
const lint: CommandModule<{}, {}> = {
    command: "lint",
    describe: "verify all test cases",
    builder: {},
    handler: () => {
        const roughs = loadRoughTestCases();

        let dirty = false;
        for (const l of Object.keys(roughLinters)) {
            logger.info(`linting: ${l}`);
            for (const rough of roughs) {
                const err = roughLinters[l](rough);
                if (err !== null) {
                    logger.error(`${l}: ${rough.file}: ${err}`);
                    dirty = true;
                }
            }
        }

        for (const l of Object.keys(linters)) {
            logger.info(`linting: ${l}`);
            for (const rough of roughs) {
                for (const test of refineTestCase(rough)) {
                    const err = linters[l](test);
                    if (err !== null) {
                        logger.error(
                            `${l}: ${test.file}: ${err}`
                        );
                        dirty = true;
                    }
                }
            }
        }

        if (dirty) {
            logger.error("linting: some checks failed, see errors above");
            process.exit(1);
        }

        logger.info("linting: all checks succeeded");
    },
};

export { lint };
