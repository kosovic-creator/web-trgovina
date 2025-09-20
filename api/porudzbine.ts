import { Router, Request, Response } from 'express';

interface Proizvod {
  id: string;
  naziv: string;
  kolicina: number;
  cena: number;
}

interface PorudzbinaBody {
  proizvodi: Proizvod[];
  korisnikId: string;
  adresa: string;
  napomena?: string;
}

const router = Router();

// POST /api/porudzbine
router.post('/', async (req: Request, res: Response) => {
  const { proizvodi, korisnikId, adresa, napomena } = req.body as PorudzbinaBody;
  if (!proizvodi || !korisnikId || !adresa) {
    return res.status(400).json({ error: 'Nedostaju obavezna polja.' });
  }

  const novaPorudzbina = {
    id: Date.now(),
    proizvodi,
    korisnikId,
    adresa,
    napomena: napomena || '',
    status: 'primljeno',
    vreme: new Date().toISOString()
  };

  // U pravoj aplikaciji ovde ide upis u bazu
  return res.status(201).json(novaPorudzbina);
});

export default router;
