import http from 'k6/http';

export default function (){
    const result = http.get("http://test-api.k6.io");
}