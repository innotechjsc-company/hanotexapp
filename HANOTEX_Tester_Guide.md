# HANOTEX Testing Guide - Hướng dẫn kiểm thử

## 📋 Tổng quan
Đây là hướng dẫn kiểm thử cho sàn giao dịch công nghệ HANOTEX. Tester sẽ sử dụng các file CSV để theo dõi tiến độ kiểm thử.

## 📁 Files Checklist
1. **`HANOTEX_Testing_Checklist_Vietnamese_English.csv`** - Checklist chi tiết với test cases
2. **`HANOTEX_Simple_Testing_Checklist.csv`** - Checklist đơn giản theo menu
3. **`HANOTEX_Detailed_Test_Cases.csv`** - Test cases chi tiết với ID

## 🎯 Cách sử dụng

### 1. Import vào Google Sheets
- Mở Google Sheets
- File → Import → Upload CSV file
- Chọn "Replace current sheet" hoặc "Create new sheet"

### 2. Cấu hình Google Sheets
- **Cột Status**: Sử dụng Data Validation với các giá trị:
  - Not Started
  - In Progress  
  - Completed
  - Failed
  - Blocked

- **Cột Priority**: Sử dụng Data Validation với các giá trị:
  - High
  - Medium
  - Low

- **Conditional Formatting**:
  - Completed: Màu xanh
  - In Progress: Màu vàng
  - Failed: Màu đỏ
  - Not Started: Màu xám

### 3. Theo dõi tiến độ
- Sử dụng Pivot Table để thống kê theo Status
- Sử dụng Filter để lọc theo Priority
- Sử dụng Charts để visualize progress

## 📊 Test Cases theo Menu

### 🏠 Trang chủ (Homepage)
- **TC001-TC005**: Kiểm tra Hero Section, Categories, Featured Technologies
- **Priority**: High
- **Focus**: Responsive design, loading performance

### 🔐 Authentication
- **TC006-TC016**: Login, Register, Validation
- **Priority**: High  
- **Focus**: Form validation, user experience

### 👤 User Profile
- **TC017-TC021**: Profile management, company info
- **Priority**: High
- **Focus**: Data accuracy, user experience

### 🔬 Technology Management
- **TC022-TC042**: Technology listing, detail, registration
- **Priority**: High
- **Focus**: CRUD operations, search/filter

### 🛠️ Services
- **TC043-TC075**: All service pages
- **Priority**: High
- **Focus**: Landing pages, contact forms

### 📰 Content & Information
- **TC076-TC100**: About, Contact, News, Events
- **Priority**: High
- **Focus**: Content display, user interaction

## 🎯 Testing Strategy

### Phase 1: Core Functionality (High Priority)
1. **Authentication System**
   - Login/Register flows
   - Form validation
   - User session management

2. **Technology Management**
   - CRUD operations
   - Search and filter
   - File uploads

3. **User Interface**
   - Responsive design
   - Navigation
   - Loading performance

### Phase 2: Business Features (Medium Priority)
1. **Services Pages**
   - Landing pages
   - Contact forms
   - Content display

2. **Content Management**
   - News and events
   - User guides
   - FAQ

### Phase 3: Advanced Features (Low Priority)
1. **Admin Features**
   - User management
   - Content management
   - Analytics

2. **Performance & Security**
   - Page load times
   - Security measures
   - Error handling

## 📝 Test Execution Process

### 1. Pre-Test Setup
- [ ] Set up test environment
- [ ] Prepare test data
- [ ] Configure test tools
- [ ] Review requirements

### 2. Test Execution
- [ ] Execute test cases in priority order
- [ ] Document bugs found
- [ ] Update test status
- [ ] Take screenshots of issues

### 3. Post-Test Activities
- [ ] Generate test report
- [ ] Document test results
- [ ] Provide feedback to development team
- [ ] Plan retesting

## 🐛 Bug Reporting Template

```
Bug ID: BUG-001
Title: [Brief description]
Priority: High/Medium/Low
Severity: Critical/Major/Minor
Environment: [Browser/Device]
Steps to Reproduce:
1. Step 1
2. Step 2
3. Step 3
Expected Result: [What should happen]
Actual Result: [What actually happens]
Screenshots: [Attach if applicable]
```

## 📊 Progress Tracking

### Daily Checklist
- [ ] Review assigned test cases
- [ ] Execute high priority tests
- [ ] Update test status
- [ ] Report bugs found
- [ ] Update progress report

### Weekly Summary
- [ ] Test execution summary
- [ ] Bug statistics
- [ ] Progress against plan
- [ ] Risk assessment
- [ ] Next week planning

## 🎯 Success Criteria

### Test Completion Criteria
- [ ] All High priority test cases executed
- [ ] All Critical bugs fixed
- [ ] All Major bugs fixed or accepted
- [ ] Performance criteria met
- [ ] Security requirements satisfied

### Quality Gates
- [ ] No Critical bugs open
- [ ] < 5 Major bugs open
- [ ] All High priority features working
- [ ] Performance within acceptable limits
- [ ] Security scan passed

## 📞 Support & Contact

### Test Environment
- **URL**: http://localhost:3000
- **Admin URL**: http://localhost:3000/admin
- **Test Data**: Available in test database

### Tools & Resources
- **Browser**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Android Chrome
- **Testing Tools**: Browser DevTools, Lighthouse
- **Documentation**: Project README, API docs

### Team Contacts
- **Development Team**: [Contact info]
- **Project Manager**: [Contact info]
- **QA Lead**: [Contact info]

---

## 📋 Quick Reference

### Test Status Values
- **Not Started**: Chưa bắt đầu
- **In Progress**: Đang thực hiện
- **Completed**: Hoàn thành
- **Failed**: Thất bại
- **Blocked**: Bị chặn

### Priority Levels
- **High**: Ưu tiên cao (Core functionality)
- **Medium**: Ưu tiên trung bình (Business features)
- **Low**: Ưu tiên thấp (Nice-to-have features)

### Browser Support
- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions

### Device Testing
- **Desktop**: 1920x1080, 1366x768
- **Tablet**: 768x1024, 1024x768
- **Mobile**: 375x667, 414x896, 360x640

---

**Lưu ý**: Cập nhật checklist thường xuyên và báo cáo tiến độ cho team lead.
