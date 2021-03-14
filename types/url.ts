export interface IUrl {
    /** Mongoose document id */
    _id: string;

    /** The short url */
    slug: string;

    /** The original url */
    url: string;
}

export default IUrl;
