import { dbClient } from "@package/db";

async function getAnalytics(urlId: number) {

    const an = await dbClient.analytics.findFirst({
        where: {
            urlId: urlId
        }
    });

    if (an == null) {
        return null;
    }

    return an;
}

async function persistAnalytics(urlId: number) {

    let an = await dbClient.analytics.findFirst({
        where: {
            urlId: urlId
        }
    });

    if (an == null) {

        an = await dbClient.analytics.create({
            data: {
                urlId: urlId,
            }
        });

    }

    an = await dbClient.analytics.update({
        data: {
            count: {
                increment: 1
            }
        },
        where: {
            urlId: urlId
        }
    });

    return an;
}

export { persistAnalytics };