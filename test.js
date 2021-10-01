import http from 'k6/http';
import {check} from 'k6';
import { Rate } from 'k6/metrics';

const failures = new Rate('failed requests');

export const options = {
    ext:{
        loadimpact:{
            projectID: '<your project id in k6 cloud>',
            name: 'K6 demo',
        },
    },
    scenarios: {
        test: {
            executor: "constant-arrival-rate",
            rate: 10,
            timeUnit: "1s",
            duration: "30s",
            preAllocatedVUs: 1,
            maxVUs: 10
        },
        foo: {
            executor: "constant-arrival-rate",
            rate: 15,
            exec: "foo",
            timeUnit: "2s",
            duration: "10s",
            preAllocatedVUs: 1,
            maxVUs: 10,
        },
    },
    vus:10,
    thresholds: {
        failed_requests: ['rate<=0'],
        http_req_duration: ['p(95)<100', 'p(99)<500'],
    }
}

export default function () {
    const result = http.get("http://test-api.k6.io");

    checkResult(result, "default", 200);
    failures.add(result.status != 200);
}

export function foo () {
    const result = http.get("http://test-api.k6.io");

    checkResult(result, "foo", 200);
    failures.add(result.status != 200);
}

function checkResult(res, tag, resCode){
    check(
        res,
        {
            ['status' + tag + ' is ' + resCode + ' (Ok)']: (r) =>
            r.status === resCode,
        },
        { my_tag: tag }
    );
}