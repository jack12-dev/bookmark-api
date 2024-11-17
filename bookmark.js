const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 9000;

// Middleware
app.use(bodyParser.json());

// Fungsi untuk membaca data bookmark dari file
const getBookmarks = () => {
    const data = fs.readFileSync('./bookmarks.json', 'utf-8');
    return JSON.parse(data);
};

// Fungsi untuk menyimpan data bookmark ke file
const saveBookmarks = (bookmarks) => {
    fs.writeFileSync('./bookmarks.json', JSON.stringify(bookmarks, null, 2));
};

// Endpoint untuk mendapatkan semua bookmark
app.get('/api/bookmarks', (req, res) => {
    const bookmarks = getBookmarks();
    res.json(bookmarks);
});

// Endpoint untuk menambah bookmark baru
app.post('/api/bookmarks', (req, res) => {
    const { title, url } = req.body;
    if (!title || !url) {
        return res.status(400).json({ message: 'Title and URL are required' });
    }

    const bookmarks = getBookmarks();
    const newBookmark = {
        id: bookmarks.length + 1,
        title,
        url
    };

    bookmarks.push(newBookmark);
    saveBookmarks(bookmarks);
    res.status(201).json(newBookmark);
});

// Endpoint untuk menghapus bookmark berdasarkan ID
app.delete('/api/bookmarks/:id', (req, res) => {
    const { id } = req.params;
    let bookmarks = getBookmarks();
    const bookmarkIndex = bookmarks.findIndex(b => b.id === parseInt(id));

    if (bookmarkIndex === -1) {
        return res.status(404).json({ message: 'Bookmark not found' });
    }

    bookmarks = bookmarks.filter(b => b.id !== parseInt(id));
    saveBookmarks(bookmarks);
    res.json({ message: 'Bookmark deleted successfully' });
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
