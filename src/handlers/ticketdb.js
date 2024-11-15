const fs = require('fs');
const path = require('path');

const ticketDataPath = path.join(__dirname, '../database/ticketData.json');
let ticketData = require(ticketDataPath);

function saveData() {
    fs.writeFileSync(ticketDataPath, JSON.stringify(ticketData, null, 2));
}

function hasActiveTicket(userId) {
    return ticketData.activeTickets && ticketData.activeTickets[userId];
}

function setActiveTicket(userId, channelId) {
    ticketData.activeTickets = ticketData.activeTickets || {};
    ticketData.activeTickets[userId] = channelId;
    saveData();
}

function clearActiveTicket(userId) {
    if (ticketData.activeTickets && ticketData.activeTickets[userId]) {
        delete ticketData.activeTickets[userId];
        saveData();
    }
}

function addTicket(ticket) {
    ticketData.tickets = ticketData.tickets || [];
    ticketData.tickets.push(ticket);
    saveData();
}

function incrementTicketCounter() {
    ticketData.ticketCounter = (ticketData.ticketCounter || 0) + 1;
    saveData();
    return ticketData.ticketCounter;
}

module.exports = {
    incrementTicketCounter,
    addTicket,
    hasActiveTicket,
    setActiveTicket,
    clearActiveTicket
};
