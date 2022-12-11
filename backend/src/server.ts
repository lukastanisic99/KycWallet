import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Issuer from './Issuer';

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

app.post('/', async (req, res) => {
    const { allDataJsonString, walletAddress, signature } = req.body;

    if (!allDataJsonString || !walletAddress || !signature) {
        res.status(500).json({});
        return;
    }

    let issuer = new Issuer();
    let cer = await issuer.KYC(allDataJsonString, walletAddress, signature);
    res.json(cer);
});

app.listen(4000, () => console.log(`Express server running on port 4000`));
