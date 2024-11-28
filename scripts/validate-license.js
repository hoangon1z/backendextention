const fs = require('fs');
const path = require('path');

function validateLicense(licenseKey) {
  const licensesPath = path.join(__dirname, '../database/licenses.json');
  
  try {
    // Đọc file licenses
    const licenses = JSON.parse(fs.readFileSync(licensesPath, 'utf8'));
    
    // Kiểm tra key có tồn tại
    const licenseData = licenses[licenseKey];
    if (!licenseData) {
      return { 
        valid: false, 
        message: 'License key không tồn tại' 
      };
    }
    
    // Kiểm tra trạng thái
    if (licenseData.status !== 'active') {
      return { 
        valid: false, 
        message: 'License đã bị vô hiệu hóa' 
      };
    }
    
    // Kiểm tra thời hạn
    const expiryDate = new Date(licenseData.expiryDate);
    if (expiryDate < new Date()) {
      return { 
        valid: false, 
        message: 'License đã hết hạn' 
      };
    }
    
    // Kiểm tra số lượng thiết bị
    if (licenseData.devices.length >= licenseData.maxDevices) {
      return { 
        valid: false, 
        message: 'Số lượng thiết bị đã đạt giới hạn' 
      };
    }
    
    return { 
      valid: true, 
      details: licenseData 
    };
  } catch (error) {
    return { 
      valid: false, 
      message: 'Lỗi hệ thống' 
    };
  }
}

// Xuất hàm để sử dụng
module.exports = { validateLicense };

// Nếu chạy trực tiếp để test
if (require.main === module) {
  const testKey = process.argv[2];
  if (testKey) {
    const result = validateLicense(testKey);
    console.log(JSON.stringify(result, null, 2));
  }
}