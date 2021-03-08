import { Request, Response } from 'express';

export const root = async (req: Request, res: Response) => {
    res.json({
        message: 'Short url creation and redirection service'
    });
};

export const information = async (req: Request, res: Response) => {
    // TODO get information on the short url
};

export const redirect = async (req: Request, res: Response) => {
    // TODO redirect to url
};

export const createUrl = async (req: Request, res: Response) => {
    // TODO create a short url
};

export default {
    root,
    information,
    redirect,
    createUrl,
};
