const express = require("express");
const noteRouter = require("./router/notes.js");
const admin = require("firebase-admin");
const keyData = require("./key.json");
const app = express();

const PORT = 3000;

admin.initializeApp({
  credential: admin.credential.cert(keyData)
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = admin.firestore();

app.use('/notes', noteRouter);

// app.post('/createUsers', async (req, res) => {
//     try {
//         // Membuat pengguna baru
//         const userJson = {
//             email: req.body.email,
//             name: req.body.name
//         };
//         const userResponse = await db.collection("users").add(userJson);

//         // Membuat catatan baru terkait dengan pengguna
//         const noteJson = {
//             title: req.body.title,
//             text: req.body.text,
//             userId: userResponse.id, // Menyimpan ID pengguna terkait dengan catatan
//             createdAt: admin.firestore.FieldValue.serverTimestamp(),
//             updatedAt: null
//         };
//         const noteResponse = await db.collection("notes").add(noteJson);

//         res.send({ user: userResponse, note: noteResponse });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send(error);
//     }
// });

// app.post('/createNote', async (req, res) => {
//     try {
//         const userId = req.body.userId;
//         const userRef = db.collection("users").doc(userId);
        
//         // Memeriksa apakah pengguna dengan ID yang diberikan ada
//         const userSnapshot = await userRef.get();
//         if (!userSnapshot.exists) {
//             res.status(404).send("User not found");
//             return;
//         }

//         // Jika pengguna ditemukan, buat catatan untuk pengguna ini
//         const noteJson = {
//             title: req.body.title,
//             text: req.body.text,
//             createdAt: admin.firestore.FieldValue.serverTimestamp(),
//             updatedAt: null,
//         };

//         // Menambahkan catatan ke koleksi catatan pengguna
//         await userRef.collection("notes").add(noteJson);
//         res.send("Note created successfully");
//     } catch (error) {
//         console.log(error);
//         res.status(500).send(error);
//     }
// });

app.post('/create', async (req, res) => {
    try {
        const id = req.body.title;
        const userJson = {
            title: req.body.title,
            text: req.body.text,
            createdAt: admin.firestore.FieldValue.serverTimestamp(), // Tambahkan waktu pembuatan data
            updatedAt: null, // Set waktu pembaruan data awalnya ke null
        };
        const response = await db.collection("notes").add(userJson);
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

app.get('/getAll', async (req, res) => {
    try {
        const userRef = db.collection("notes");
        const snapshot = await userRef.get();
        let responseArr = [];
        snapshot.forEach(doc => {
            responseArr.push(doc.data());
        });
        res.send(responseArr);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

app.get('/read/:id', async (req, res) => {
    try {
        const userRef = db.collection("notes").doc(req.params.id);
        const doc = await userRef.get();
        if (!doc.exists) {
            res.status(404).send("Note not found");
        } else {
            res.send(doc.data());
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

app.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const userRef = db.collection("notes").doc(id);
        const updateData = {
            ...req.body,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(), // Update waktu pembaruan data
        };
        const response = await userRef.update(updateData);
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

app.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const userRef = db.collection("notes").doc(id);
        const response = await userRef.delete();
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

app.get('/', (req, res) => res.send("Welcome to my API"));

app.listen(PORT, () => console.log(`Server Running on port: http://localhost:${PORT}`));
