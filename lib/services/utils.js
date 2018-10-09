import uuid from 'uuid';

export function dumpUser(user) {
    const dump = {
        id         : user.id,
        status     : user.status,
        email      : user.email,
        firstName  : user.firstName,
        secondName : user.secondName,
        createdAt  : user.createdAt,
        updatedAt  : user.updatedAt,
        role       : user.role
    };

    if (user.tweet) {
        dump.links = {
            tweet : user.tweet.map(item => {
                return {
                    type : 'Tweet',
                    id   : item.id
                };
            })
        };
    }

    return dump;
}

export function dumpTweet(tweet) {
    const dump = {
        id          : tweet.id,
        userId      : tweet.userId,
        title       : tweet.title,
        subtitle    : tweet.subtitle,
        text        : tweet.text,
        isPublished : tweet.isPublished,
        image       : tweet.image,
        createdAt   : tweet.createdAt,
        updatedAt   : tweet.updatedAt,
        links       : {
            authors : [
                {
                    type : 'User',
                    id   : tweet.userId
                }
            ]
        }
    };

    return dump;
}

export function dumpImage(name, url) {
    return {
        id : name.split('.')[0],
        url
    };
}

export function createImageName(image) {
    const imageName = uuid.v1();

    const match = image.name.match(/.+\.([^.]+)$/);
    const imageExtension = match ? match[1] : '';

    const fullImageName = `${imageName}.${imageExtension}`;

    return fullImageName;
}

function getLinksIds(data, include) {
    const linksIds = {};
    let linksArr = [];

    include.forEach(type => {
        linksIds[type] = [];

        data.forEach(item => {
            linksArr = linksArr.concat(item.links[type]);
        });

        linksIds[type] = linksArr.map(link => link.id);
    });

    return linksIds;
}

export async function getLinked(data, include, query, includeMap, dumpMap) {
    if (!include) return;

    const linked = {};
    const linksIds = getLinksIds(data, include);

    for (const type in linksIds) {
        /* istanbul ignore else  */
        if (linksIds.hasOwnProperty(type)) {
            const { model } = includeMap[type];

            linked[type] = await model.findAll({ ...query, where: { id: linksIds[type] } });
            linked[type] = linked[type].map(dumpMap[type]);
        }
    }

    return linked;
}
