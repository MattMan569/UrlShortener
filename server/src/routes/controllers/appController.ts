import { Request, Response } from 'express';
import nanoid from 'nanoid';
import Url from './../../db/models/urlModel';

/** Provide details about the service */
export const root = async (req: Request, res: Response) => {
    res.json({
        message: 'Short url creation and redirection service',
        routes: {
            appInfo: 'GET / - Display this message',
            urlInfo: 'GET /url/:id - Show information about the provided short url',
            redirect: 'GET /:id - Redirect to the provided short url\'s original url',
            create: 'POST /url body:{ slug?: string, url: string } - Create a short url to the provided url, optionally with a custom slug',
        }
    });
};

/** Provide details on the provided short url */
export const information = async (req: Request, res: Response) => {
    let slug = req.params.id;

    if (!slug) {
        return res.status(400).json('Missing slug');
    }

    slug = slug.toLowerCase();
    const url = await Url.findOne({ slug });

    if (!url) {
        return res.status(404).json('Invalid slug');
    }

    res.json({
        url: url.url,
        slug: url.slug,
    });
};

/** Redirect to the original url from the short id */
export const redirect = async (req: Request, res: Response) => {
    let slug = req.params.id;

    if (!slug) {
        return res.status(400).json('Missing slug');
    }

    slug = slug.toLowerCase();
    const url = await Url.findOne({ slug });

    if (!url) {
        return res.status(404).json('Invalid slug');
    }

    res.redirect(url.url);
};

/** Create a new short url */
export const createUrl = async (req: Request, res: Response) => {
    try {
        let { url, slug }: { url: string, slug: string } = req.body;

        if (!url) {
            res.status(400).json('You must include a url');
        }

        if (slug) {
            slug = slug.toLowerCase();
        }

        // Add the http protocol if there is no protocol in the url
        if (url.indexOf('http://') < 0 && url.indexOf('https://') < 0) {
            // Prepend www. if it is not in the url
            if (url.indexOf('www.') < 0) {
                url = `www.${url}`;
            }

            url = `http://${url}`;
        }

        const urlDoc = await Url.create({
            slug: slug || nanoid.nanoid(10).toLowerCase(),
            url,
        });

        console.log(urlDoc._id);

        res.status(201).json(urlDoc);
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Duplicate slug name
            if (error.errors.slug?.kind === 'unique') {
                return res.status(400).json('That slug name is already in use');
            }

            // Invalid url format
            if (error.errors.url) {
                return res.status(400).json((error.errors.url.reason as Error).message);
            }

            console.log('Unhandled ValidationError', error);
            return res.status(400).json('Unhandled ValidationError');
        }

        console.error('Unhandeled createUrl error', error);
        res.status(500).json('Unhandled createUrl error');
    }
};

export default {
    root,
    information,
    redirect,
    createUrl,
};
