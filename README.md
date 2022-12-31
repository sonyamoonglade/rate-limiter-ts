# SUBNET NETWORK RATE LIMITER

[![TypeScript](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://typescriptlang.org)

This project is meant to rate limit requests coming from the same subnet.\
Uses IPv4 only.


✓ **Satisfies RFC6585**

## Configuration
- Define a subnet mask for figuring out a network part of IPv4
- Choose desirable RPS for your service
- Moreover, you can pick any ban duration you want. If subnet exceeds a limit for RPS - it gets banned
- Host and Port for network socket

For more details, please see config.yml

## How to run ?

    $ git clone https://github.com/sonyamoonglade/rate-limiter-ts

    $ cd rate-limiter-ts

    $ make docker-build

    $ docker run -d -p 8000:8000 ratelimiter:latest

This will boot an application and open port 8000.


## Usage

    Service exposes 1 public endpoint:

    GET http(s)://example.com/rate

If everything is fine and RPS for certain subnet is not exceeded then service will respond 200 OK.\
Otherwise, the service will give back [RFC6585](https://www.rfc-editor.org/rfc/rfc6585#section-4) form as a response and Retry-After header.