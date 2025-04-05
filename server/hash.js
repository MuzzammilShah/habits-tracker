const bcrypt = require('bcryptjs');

const plainPassword = '<enter-your-password-here>'; // Replace with the password you want to hash
bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) throw err;
  console.log('Hashed Password:', hash);
});