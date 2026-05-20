const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/* ======================================
   DATABASE SEMENTARA (ARRAY IN MEMORY)
   ====================================== */

// Data booking disimpan di array
let bookings = [];

// Data member VIP disimpan di array
let vipMembers = [];

// Auto increment ID
let bookingId = 1;
let vipId = 1;

/* ======================================
   ROOT
   ====================================== */
app.get("/", (req, res) => {
    res.send("SevenMassageSpa API Running Without Database");
});

/* ======================================
   BOOKING ROUTES
   ====================================== */

// CREATE BOOKING
app.post("/booking", (req, res) => {
    const { name, phone, service, date, time } = req.body;

    // Validasi data
    if (!name || !phone || !service || !date || !time) {
        return res.status(400).json({
            success: false,
            message: "Data booking tidak lengkap"
        });
    }

    // Simpan ke array
    const newBooking = {
        id: bookingId++,
        name,
        phone,
        service,
        date,
        time,
        status: "pending",
        created_at: new Date().toISOString()
    };

    // Tambahkan ke awal array
    bookings.unshift(newBooking);

    // Response
    res.json({
        success: true,
        message: "Booking berhasil disimpan",
        data: newBooking
    });
});

// GET ALL BOOKINGS
app.get("/booking", (req, res) => {
    res.json({
        success: true,
        total: bookings.length,
        data: bookings
    });
});

// ADMIN GET ALL BOOKINGS
app.get("/bookings", (req, res) => {
    res.json({
        success: true,
        total: bookings.length,
        data: bookings
    });
});

// UPDATE STATUS BOOKING
app.put("/booking/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    const booking = bookings.find(item => item.id === id);

    if (!booking) {
        return res.status(404).json({
            success: false,
            message: "Booking tidak ditemukan"
        });
    }

    booking.status = status || booking.status;

    res.json({
        success: true,
        message: "Status booking berhasil diperbarui",
        data: booking
    });
});

// DELETE BOOKING
app.delete("/booking/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = bookings.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "Booking tidak ditemukan"
        });
    }

    const deleted = bookings.splice(index, 1);

    res.json({
        success: true,
        message: "Booking berhasil dihapus",
        data: deleted[0]
    });
});

/* ======================================
   VIP MEMBER ROUTES
   ====================================== */

// REGISTER VIP MEMBER
app.post("/vip", (req, res) => {
    const { name, phone } = req.body;

    if (!name || !phone) {
        return res.status(400).json({
            success: false,
            message: "Data VIP tidak lengkap"
        });
    }

    // Cek apakah nomor sudah terdaftar
    const existing = vipMembers.find(vip => vip.phone === phone);

    if (existing) {
        return res.json({
            success: false,
            message: "Nomor sudah terdaftar sebagai VIP"
        });
    }

    // Simpan ke array
    const newVip = {
        id: vipId++,
        name,
        phone,
        created_at: new Date().toISOString()
    };

    vipMembers.unshift(newVip);

    res.json({
        success: true,
        message: "VIP berhasil didaftarkan",
        data: newVip
    });
});

// GET ALL VIP MEMBERS
app.get("/vip", (req, res) => {
    res.json({
        success: true,
        total: vipMembers.length,
        data: vipMembers
    });
});

// DELETE VIP MEMBER
app.delete("/vip/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = vipMembers.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "Member VIP tidak ditemukan"
        });
    }

    const deleted = vipMembers.splice(index, 1);

    res.json({
        success: true,
        message: "Member VIP berhasil dihapus",
        data: deleted[0]
    });
});

/* ======================================
   START SERVER
   ====================================== */
app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});