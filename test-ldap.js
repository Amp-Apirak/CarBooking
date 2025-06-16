// test-ldap.js
const ldap = require('./config/ldap');
ldap.authenticate('invaliduser', 'invalidpass', err => {
  if (err) console.log('LDAP setup OK, got expected error:', err.name);
  else console.log('LDAP setup might be wrong: no error on invalid credentials');
  ldap.close(); // ปิด connection
});
