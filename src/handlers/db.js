const fs = require('fs');
const path = require('path');


const dbPath = path.join(__dirname, '../database/ticketData.json');


function readDB() {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Veritabanı okunamadı:', error);
        return { ticketCounter: 0, tickets: [] };
    }
}


function writeDB(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Veritabanı yazılamadı:', error);
    }
}


function incrementTicketCounter() {
    const data = readDB();
    data.ticketCounter += 1;
    writeDB(data);
}


function addTicket(ticketInfo) {
    const data = readDB();
    data.tickets.push(ticketInfo);
    writeDB(data);
}


function createTicket(ticketInfo) {
    const now = new Date();
    const ticketData = {
        ...ticketInfo,
        createdAt: {
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString()
        }
    };
    addTicket(ticketData);
}


module.exports = { incrementTicketCounter, addTicket, createTicket };
