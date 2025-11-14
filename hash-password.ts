import * as bcrypt from 'bcrypt';

async function generateHash() {
  const newPassword = 'newStaff123'; 
  const hashed = await bcrypt.hash(newPassword, 10);
  console.log('Hashed password:', hashed);
}

generateHash();
