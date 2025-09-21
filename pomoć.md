  const handleEdit = (p: Porudzbina) => {
    setPorudzbinaForm({ korisnik: p.korisnik, ukupno: p.ukupno, status: p.status, kreiran: p.kreiran });
    setEditPorudzbinaId(p.id);
  };

  const handleDelete = async (id: string) => {
    await fetch('/api/porudzbine', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    // Dodaj ponovno učitavanje porudžbina
  };
