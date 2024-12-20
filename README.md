# Integration for PDU check

This is an Integration that runs on a schedule (nightly) to check PDU usage.
It sends an email after tabulating results.

## Setup

Modify the env.sh file to set variables suitable for your scenario.

Then, dot-source that script, and run the setup script.

```
. ./env.sh
./setup-appint-pdu-report-sample.sh
```

## Teardown

The cleanup script should remove everything it had set up.

```
. ./env.sh
./clean-appint-pdu-report-sample.sh
```
