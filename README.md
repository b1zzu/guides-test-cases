# Test Cases

Forked from the Integreatly Test Cases Framework: 
https://github.com/integr8ly/integreatly-operator/tree/master/test-cases 

## Index

- [How to create a test case](#How-to-create-a-test-case)
- [How to estimate a test case](#How-to-estimate-a-test-case)
- [How to create Jira tasks for the manual tests](#How-to-create-Jira-tasks-for-the-manual-tests)
- [List and export the test cases](#List-and-export-the-test-cases)
- [Prettier](#Prettier)

## How to create a test case

Copy the test template to a category inside the `tests/` directory:

```
cp fixtures/test-template.md tests/somecategory/some-test.md
```

and edit the test case following the template structure.

> If you are adding an automated test there is no need to fill
> the **Prerequisites** and **Steps** sections

Once your done ensure the file name and the markdown format are correct:

```bash
# to verify the test cases
npm run lint

# to fix the name
npm run rename

# to fix the format
npm run prettier
```

Commit everything and open a new PR.

## How to estimate a test case

Each manual test case should have a rough estimation of the time (in hours) required to manually complete it.

The estimation should be set in the test case metadata like this

```
---
estimate: 2h
---

# Z00 - My test
```

- Use this scale for the estimation: 15m, 30m 1h, 2h, 3h, 5h, 8h, 13h
- If the estimated tests is bigger than 8h than it should be split
- When estimating the test do not count the time of reporting bugs, or debugging issues
- Try to estimate the test as someone that is doing it for the first time

## How to create Jira tasks for the manual tests

Prerequisites:

- Nodejs >= 10

To crate the Jira tasks for the test cases you need first to create an Epic in Jira with the `fixVersion` that you want to target. Only test cases with the same target version or marked as `per-release` or `per-build` will be created in the Epic.

To see the list of test cases that will be created in the Epic you can use the `export` cmd:

```bash
./tools.sh export csv | column -t -s,
```

Use the `jira` cmd to create the Jira tasks for the test cases and add them to the Epic

```bash
JIRA_USERNAME=yourusername JIRA_PASSWORD=yourpassword ./tools.sh jira --epic EPICKEY-00
```

If you need to link the new tasks to the task of a previous test round use the `previous-epic` option:

```bash
JIRA_USERNAME=yourusername JIRA_PASSWORD=yourpassword ./tools.sh jira --epic EPICKEY-01
```

> The `previous-epic` option will link each new task to the task in the previous epic with the same ID and it
> will set the Priority of the new task depending on the Resolution of the previous task.
>
> Resolution -> Priority:
>
> - Rejected -> Blocker
> - Deferred -> Critical
> - [New Test] -> Major
> - Won't Do -> Minor
> - Done -> Optional
>
> And automatically close as **Won't Do** all tests marked as **Won't Do** or **Done** in the previous Epic

## List and export the test cases

Use the `export csv` cmd to list and export the test cases in csv:

```
./tools.sh export csv 
```

use the `--output` option to save it to file

```
./tools.sh export csv --output /tmp/alltests.csv
```

to export only specific test cases use the `--filter` option:

```
./tools.sh export csv --filter tags=^something
```

to pretty print the csv output on the terminal:

```
./tools.sh export csv | column -t -s, | less -S
```

## Prettier

> All of the test cases must be prettified before being committed

You can prettify the test cases using the command line:

```bash
npm run prettier
```

Or using the VS Code extension: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
