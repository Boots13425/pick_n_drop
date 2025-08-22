// const express = require('express');
// const app = express();
// app.use(express.json());

// let images = []; // {id, url, username, status: 'pending'|'approved'|'rejected'}
// let trips = []; // {user, tripData, imageId}

// // Endpoint to upload image (user)
// app.post('/api/upload-image', (req, res) => {
//     const {url, username} = req.body;
//     const id = Date.now().toString();
//     images.push({id, url, username, status: 'pending'});
//     res.json({success: true, id});
// });

// // Get pending images (admin)
// app.get('/api/pending-images', (req, res) => {
//     res.json(images.filter(img => img.status === 'pending'));
// });

// // Approve image (admin)
// app.post('/api/approve-image', (req, res) => {
//     const {id} = req.body;
//     const img = images.find(i => i.id === id);
//     if (img) img.status = 'approved';
//     res.json({success: true});
// });

// // Reject image (admin)
// app.post('/api/reject-image', (req, res) => {
//     const {id} = req.body;
//     const img = images.find(i => i.id === id);
//     if (img) img.status = 'rejected';
//     res.json({success: true});
// });

// // Post trip (user, only if image approved)
// app.post('/api/postTrip', (req, res) => {
//     const {user, tripData, imageId} = req.body;
//     const img = images.find(i => i.id === imageId);
//     if (!img || img.status !== 'approved') {
//         return res.status(403).json({error: 'Image not approved'});
//     }
//     trips.push({user, tripData, imageId});
//     res.json({success: true});
// });

// app.listen(3000, () => {
//     console.log('Server running on http://localhost:3000');
// });