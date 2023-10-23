const getAll = async (req, res) => {
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
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createNotes = async (req, res) => {
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
};

module.exports = {
    getAll: getAll,
    createNotes: createNotes
};