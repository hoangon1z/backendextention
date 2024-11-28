const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { program } = require('commander');

// Cấu hình CLI
program
  .option('--customer <name>', 'Tên khách hàng')
  .option('--max-devices <number>', 'Số thiết bị tối đa', '3')
  .option('--duration <days>', 'Thời hạn (ngày)', '365')
  .parse(process.argv);

function generateLicenseKey() {
  return crypto.randomBytes(16).toString('hex');
}

function createLicense(options) {
  const licenseKey = generateLicenseKey();
  const currentDate = new Date();
  const expiryDate = new Date(currentDate.setDate(currentDate.getDate() + parseInt(options.duration)));

  const licenseDetails = {
    key: licenseKey,
    customerName: options.customer,
    createdAt: new Date().toISOString(),
    expiryDate: expiryDate.toISOString(),
    maxDevices: parseInt(options.maxDevices),
    devices: [],
    status: 'active'
  };

  // Đọc file licenses hiện tại
  const licensesPath = path.join(__dirname, '../database/licenses.json');
  let licenses = {};
  
  try {
    if (fs.existsSync(licensesPath)) {
      licenses = JSON.parse(fs.readFileSync(licensesPath, 'utf8'));
    }
  } catch (error) {
    console.error('Lỗi đọc file licenses:', error);
  }

  // Thêm license mới
  licenses[licenseKey] = licenseDetails;

  // Ghi lại file
  fs.writeFileSync(licensesPath, JSON.stringify(licenses, null, 2), 'utf8');

  console.log('License được tạo:', licenseDetails);
  return licenseDetails;
}

// Tạo license với các tham số từ CLI
createLicense(program.opts());