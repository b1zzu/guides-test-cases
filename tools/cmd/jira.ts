import * as markdown2confluence from "markdown2confluence-cws";
import { CommandModule } from "yargs";
import { assertEpic, Issue, Jira } from "../lib/jira";
import {
    filterTests,
    loadTestCases,
    stringToFilter,
    TestCase,
} from "../lib/test-case";
import { loadTestRuns, TestRun } from "../lib/test-run";
import { logger } from "../lib/winston";

const GENERAL_GUIDELINES_URL =
    "https://github.com/b1zzu/guides-test-cases/blob/master/common/general-guidelines.md";

function appendLinkToGeneralGuidelines(content: string): string {
    const guidelines = `## General guidelines for testing\n${GENERAL_GUIDELINES_URL}`;
    return content.concat("\n", guidelines);
}

function extractSprintId(sprintInfo: string[] | number): number {
    if (sprintInfo != null) {
        const found = /(id\=)(\d+)/.exec(sprintInfo[0]);
        if (found) {
            return parseInt(found[2], 10);
        }
    }
    return null;
}

function prependOriginLink(
    content: string,
    file: string,
    link: string
): string {
    return `**Origin:** [${file}](${link})\n\n${content}`;
}

function toPriority(run?: TestRun) {
    if (!run) {
        return "Major"; // without a previous run
    }

    switch (run.result) {
        case "Failed":
            return "Blocker";
        case "Blocked":
            return "Critical";
        case "Passed":
            return "Optional";
        case "Skipped":
            return "Minor";
    }
}

function toIssue(
    test: TestCase,
    epicKey: string,
    projectKey: string,
    sprint: number,
    priority: string
): Issue {
    let content = prependOriginLink(test.content, test.file, test.url);

    content = appendLinkToGeneralGuidelines(content);

    const title = `${test.id} - ${test.title}`;

    return {
        fields: {
            assignee: null,
            customfield_12311140: epicKey,
            customfield_12310940: sprint,
            description: markdown2confluence(content),
            issuetype: { name: "Task" },
            labels: ["test-case"],
            priority: { name: priority },
            project: { key: projectKey },
            summary: title,
        },
    };
}

function toIssueLink(run: TestRun) {
    return {
        outwardIssue: { key: run.issue.key },
        type: { name: "Sequence" },
    };
}

interface Args {
    jiraUsername: string;
    jiraPassword: string;
    epic: string;
    previousEpic?: string;
    filter?: string[];
    dryRun: boolean;
}

// tslint:disable:object-literal-sort-keys
const jira: CommandModule<{}, Args> = {
    command: "jira",
    describe: "create Jira task for each test case",
    builder: {
        "jira-username": {
            demand: true,
            default: process.env.JIRA_USERNAME,
            describe: "Jira username or set JIRA_USERNAME",
            type: "string",
        },
        "jira-password": {
            demand: true,
            default: process.env.JIRA_PASSWORD,
            describe: "Jira password or set JIRA_PASSWORD",
            type: "string",
        },
        epic: {
            demand: true,
            describe: "key of the epic to use as parent of all new tasks",
            type: "string",
        },
        "previous-epic": {
            describe: "link the new taks to a previous epic",
            type: "string",
        },
        filter: {
            describe: "filter test to create by most of the fields",
            type: "array",
        },
        "dry-run": {
            describe: "print test cases that will be create",
            type: "boolean",
            default: false,
        },
    },
    handler: async (args) => {
        const jiraApi = new Jira(args.jiraUsername, args.jiraPassword);

        const epic = await jiraApi.findIssue(args.epic);
        assertEpic(epic);

        const sprintId = extractSprintId(epic.fields.customfield_12310940);

        let previousRuns: TestRun[] = [];

        if (args.previousEpic) {
            const previousEpic = await jiraApi.findIssue(args.previousEpic);
            assertEpic(previousEpic);

            previousRuns = await loadTestRuns(
                jiraApi,
                `"Epic Link"  = ${previousEpic.key}`
            );
        }

        const project = epic.fields.project.key;

        let tests = loadTestCases();

        if (args.filter !== undefined) {
            tests = filterTests(tests, stringToFilter(args.filter));
        }

        for (const test of tests) {
            const previousRun = previousRuns.find((run) => run.id === test.id);

            const issue = toIssue(
                test,
                args.epic,
                project,
                sprintId,
                toPriority(previousRun)
            );

            if (args.dryRun) {
                logger.info(
                    `will create task: '${issue.fields.summary}' in project '${issue.fields.project.key}'`
                );
            } else {
                const result = await jiraApi.addNewIssue(issue);
                logger.info(
                    `created task '${result.key}' '${issue.fields.summary}'`
                );

                if (previousRun) {
                    await jiraApi.addLinkToIssue(
                        result.key,
                        toIssueLink(previousRun)
                    );
                    logger.info(`   linked to '${previousRun.issue.key}'`);

                    if (previousRun.result === "Passed" || previousRun.result === "Skipped") {
                        await jiraApi.resolveIssue(result.key);
                        logger.info(`   automatically resolved as "Won't Do"`);
                    }
                }
            }
        }
    },
};

export { jira };
