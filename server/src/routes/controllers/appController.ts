import { Request, Response } from 'express';
import nanoid from 'nanoid';
import escape from 'escape-string-regexp';
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
    const url = await Url.findOne({ slug: new RegExp(escape(req.params.id), 'i') });

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
    const url = await Url.findOne({ slug: req.params.id });

    if (!url) {
        return res.status(404).json('Invalid slug');
    }

    res.redirect(url.url);
};

/** Create a new short url */
export const createUrl = async (req: Request, res: Response) => {
    try {
        const slug: string = req.body.slug;
        let url: string = req.body.url;

        if (!url) {
            res.status(400).json('You must include a url');
        }

        // Check if the provided slug is already being used
        if (slug) {
            const collision = await Url.find({ slug: new RegExp(escape(slug), 'i') });
            if (collision.length > 0) {
                console.log(collision);
                return res.status(400).json('That slug name is already in use');
            }
        }

        // If there is not a protocol included in the url, add one
        if (url.indexOf('http://') < 0 && url.indexOf('https://') < 0) {
            url = `http://${url}`;
        }

        const urlDoc = await Url.create({
            slug: slug || nanoid.nanoid(10),
            url,
        });

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
