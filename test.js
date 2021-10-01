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
    vus:10,
    duration: '5s',
    thresholds: {
        failed_requests: ['rate<=0'],
        http_req_duration: ['p(95)<100', 'p(99)<500'],
    }
}
export default function (){
    const result = http.get("http://test-api.k6.io");

    check(result, {
        'Result code is 200': (r) => r.status === 200,
    });
}