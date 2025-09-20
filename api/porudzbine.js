const express = require('express');
const router = express.Router();

// POST /api/porudzbine
router.post('/', async (req, res) => {
    // Pretpostavljamo da je body JSON sa podacima o porudžbini
    const { proizvodi, korisnikId, adresa, napomena } = req.body;
    if (!proizvodi || !korisnikId || !adresa) {
        return res.status(400).json({ error: 'Nedostaju obavezna polja.' });
    }

    // Primer: Kreiranje porudžbine (umesto baze, vraćamo podatke)
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

module.exports = router;
