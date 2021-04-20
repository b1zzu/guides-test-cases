## General Guidelines

### Test Users

You should already have a redhat user created as part of the **Scenario 1**:
https://docs.google.com/document/d/1NlIFtHhFJ11V1dz-fwaYYYhfKeaQqP9bYVsDnEnEBek 

## Report Issues or Feedback

All encountered **Bugs/Issues** even if minors should be reported here:
https://docs.google.com/spreadsheets/d/1C2cu6nXtRrH4rKbSfpDObMbe1U0D5B8FBJVkCil9n0g

Please report also any Feedback you have to the same spreadsheet.

### Report the Result

Please close the Task once the test is completed with one of the following Resolutions.

Resolution Legend:

- Passed => Done
- Failure => Rejected
- Blocked => Deferred
- Skipped => Won't Do

#### Passed

If the test succeeds, resolve this task with `Done`.

> Attention: Never resolve a test as passed if not all steps have passed, because otherwise, it would
> not be retested in the next round.

#### Failed

If the test fails, [report the bug](#report-issues-or-feedback), write a **comment** with the reason why it failed,
and resolve this task with `Rejected`.

#### Blocked

All tests that can't be executed or will not be executed in this round and should be executed in the next
round. They should be marked as `Deferred`.

Ideally, the task should be flagged as blocked before start testing, therefore the tester should never
use the `Deferred` resolution.

#### Skipped

All tests that have Passed in the previous round and that have not been executed in this test round.
They should be marked as `Won't Do`

> Attention: Never resolve a test as skipped if the previous didn't pass, because otherwise, it would
> not be retested in the next round.
