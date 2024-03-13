
const Contact = require('../models/ContactModel')
exports.createContact = async (req, res) => {
    try {
      const { Name, Email, PhoneNumber, Message } = req.body;
  
      // Validate request data (you might want to add more validation)
      if (!Name || !Email || !PhoneNumber || !Message) {
        return res.status(400).json({ error: 'Please provide all required fields.' });
      }
  
      const newContact = new Contact({
        Name,
        Email,
        PhoneNumber,
        Message,
      });
  
      // Save the new contact to the database
      await newContact.save();
  
      res.status(201).json({ message: 'Contact created successfully.' });
    } catch (error) {
      console.error('Error creating contact:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
  
  exports.getContacts = async (req, res) => {
    try {
      const contacts = await Contact.find();
      res.status(200).json(contacts);
    } catch (error) {
      console.error('Error retrieving contacts:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
