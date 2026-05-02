import http from "k6/http";
import { sleep } from "k6";

export const options = {
    vus: 100,
    duration: '30s',
};

export default function () {
    // Use 'localhost' if running k6 locally, or 'server' if running inside Docker
    http.get('http://127.0.0.1:3000/api/v1/url/UP8wwgt7');
    sleep(0.5);
}