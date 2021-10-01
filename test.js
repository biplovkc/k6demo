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
            executor: "ramping-vus",
            startVUs: 1,
            stages: [
                {
                    duration: "30s",
                    target: 5, // normal load
                },
                {
                    duration: "10s",
                    target: 20, //spike to 15 vus
                },
                {
                    duration: "10s",
                    target: 40,
                },
                {
                    duration: "10s",
                    target: 50
                }
            ]
        },
    },
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