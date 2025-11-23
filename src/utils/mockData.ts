import { Complaint } from '../App';

export const mockComplaints: Complaint[] = [
  {
    id: 'COMP-001',
    studentId: 'STU-001',
    studentName: 'Rahul Sharma',
    university: 'Indian Institute of Technology (IIT) Delhi',
    category: 'Academics',
    description: 'Unable to access course materials on the institute portal. Getting authentication errors repeatedly despite multiple password resets.',
    priority: 'High',
    status: 'In Progress',
    escalationLevel: 1,
    dateSubmitted: '2024-01-15',
    lastUpdated: '2024-01-15',
    daysOpened: 8,
    assignedDepartment: 'academics',
    assignedDepartmentHead: 'Dr. Priya Sharma',
    departmentAssignedBy: 'Dr. Rajesh Kumar (Admin)',
    departmentAssignedAt: '2024-01-15T10:00:00Z',
    attachments: [
      {
        id: 'ATT-001',
        name: 'portal-error-screenshot.png',
        type: 'image/png',
        size: 245760,
        url: '#',
        uploadedAt: '2024-01-15T09:30:00Z'
      }
    ],
    comments: [
      {
        id: 'C1',
        author: 'Dr. Priya Sharma',
        message: 'Complaint received and acknowledged. Our technical team is investigating the portal authentication issues. Will update within 24 hours.',
        timestamp: '2024-01-15T11:00:00Z',
        role: 'department-head'
      }
    ]
  },
  {
    id: 'COMP-002',
    studentId: 'STU-001',
    studentName: 'Rahul Sharma',
    university: 'Indian Institute of Technology (IIT) Delhi',
    category: 'Hostel',
    description: 'Water leakage in hostel room H-412 causing damage to personal belongings including laptop and books. Urgent repair needed.',
    priority: 'Medium',
    status: 'In Progress',
    escalationLevel: 1,
    dateSubmitted: '2024-01-10',
    lastUpdated: '2024-01-12',
    daysOpened: 15,
    assignedDepartment: 'student-affairs',
    assignedDepartmentHead: 'Prof. Rajesh Kumar',
    departmentAssignedBy: 'Dr. Rajesh Kumar (Admin)',
    departmentAssignedAt: '2024-01-10T14:00:00Z',
    attachments: [
      {
        id: 'ATT-002',
        name: 'hostel-damage-photos.pdf',
        type: 'application/pdf',
        size: 1024000,
        url: '#',
        uploadedAt: '2024-01-10T14:20:00Z'
      }
    ],
    comments: [
      {
        id: 'C2',
        author: 'Prof. Rajesh Kumar',
        message: 'Maintenance team has been notified and will inspect the room tomorrow. Temporary accommodation arranged if needed.',
        timestamp: '2024-01-12T10:30:00Z',
        role: 'department-head'
      }
    ]
  },
  {
    id: 'COMP-003',
    studentId: 'STU-002',
    studentName: 'Priya Singh',
    university: 'Jawaharlal Nehru University (JNU), New Delhi',
    category: 'Mess',
    description: 'Consistent food quality issues in the central mess. Multiple students have reported stomach problems after meals.',
    priority: 'High',
    status: 'Escalated',
    escalationLevel: 2,
    dateSubmitted: '2024-01-05',
    lastUpdated: '2024-01-18',
    daysOpened: 18,
    assignedDepartment: 'food-services',
    assignedDepartmentHead: 'Dr. Anita Gupta',
    departmentAssignedBy: 'Dr. Rajesh Kumar (Admin)',
    departmentAssignedAt: '2024-01-05T09:00:00Z',
    comments: [
      {
        id: 'C3',
        author: 'Dr. Anita Gupta',
        message: 'This is a serious concern. We have initiated a comprehensive review of our food safety protocols and vendor quality checks.',
        timestamp: '2024-01-18T14:00:00Z',
        role: 'department-head'
      }
    ]
  },
  {
    id: 'COMP-004',
    studentId: 'STU-003',
    studentName: 'Arjun Reddy',
    university: 'Indian Institute of Technology (IIT) Bombay',
    category: 'Facilities',
    description: 'Central library WiFi connectivity issues persisting for over a month. Unable to access online journals and databases.',
    priority: 'Medium',
    status: 'Pending',
    escalationLevel: 1,
    dateSubmitted: '2024-01-01',
    lastUpdated: '2024-01-01',
    daysOpened: 32,
    comments: []
  },
  {
    id: 'COMP-005',
    studentId: 'STU-004',
    studentName: 'Ananya Patel',
    university: 'University of Delhi',
    category: 'Administration',
    description: 'Academic transcript processing delayed for over 3 weeks. Need urgent processing for scholarship application deadline.',
    priority: 'High',
    status: 'In Progress',
    escalationLevel: 1,
    dateSubmitted: '2023-12-20',
    lastUpdated: '2023-12-20',
    daysOpened: 45,
    assignedDepartment: 'administration',
    assignedDepartmentHead: 'Mrs. Sunita Patel',
    departmentAssignedBy: 'Dr. Rajesh Kumar (Admin)',
    departmentAssignedAt: '2023-12-21T10:00:00Z',
    comments: [
      {
        id: 'C4',
        author: 'Mrs. Sunita Patel',
        message: 'Your transcript request has been prioritized due to the scholarship deadline. Processing will be completed within 48 hours.',
        timestamp: '2024-01-20T16:00:00Z',
        role: 'department-head'
      }
    ]
  },
  {
    id: 'COMP-006',
    studentId: 'STU-005',
    studentName: 'Vikash Kumar',
    university: 'Indian Institute of Science (IISc), Bangalore',
    category: 'Hostel',
    description: 'Heating system malfunction in PhD hostel block during winter season. Room temperature dropping below acceptable levels.',
    priority: 'High',
    status: 'In Progress',
    escalationLevel: 1,
    dateSubmitted: '2024-01-08',
    lastUpdated: '2024-01-20',
    daysOpened: 22,
    assignedDepartment: 'student-affairs',
    assignedDepartmentHead: 'Prof. Rajesh Kumar',
    departmentAssignedBy: 'Dr. Rajesh Kumar (Admin)',
    departmentAssignedAt: '2024-01-08T11:00:00Z',
    comments: [
      {
        id: 'C5',
        author: 'Prof. Rajesh Kumar',
        message: 'Emergency heating units have been deployed. Permanent system repair scheduled for this weekend.',
        timestamp: '2024-01-20T14:00:00Z',
        role: 'department-head'
      }
    ]
  },
  {
    id: 'COMP-007',
    studentId: 'STU-006',
    studentName: 'Sneha Gupta',
    university: 'National Institute of Technology (NIT) Trichy',
    category: 'Academics',
    description: 'Final semester project submission portal not working. Unable to upload project documents despite multiple attempts.',
    priority: 'High',
    status: 'Pending',
    escalationLevel: 1,
    dateSubmitted: '2024-01-18',
    lastUpdated: '2024-01-18',
    daysOpened: 5,
    comments: []
  },
  {
    id: 'COMP-008',
    studentId: 'STU-007',
    studentName: 'Amit Joshi',
    university: 'Indian Institute of Management (IIM) Ahmedabad',
    category: 'Facilities',
    description: 'Air conditioning not working in lecture hall LH-3. Affecting concentration during important MBA classes.',
    priority: 'Medium',
    status: 'In Progress',
    escalationLevel: 1,
    dateSubmitted: '2024-01-16',
    lastUpdated: '2024-01-19',
    daysOpened: 7,
    assignedDepartment: 'facilities',
    assignedDepartmentHead: 'Eng. Vikram Singh',
    departmentAssignedBy: 'Dr. Rajesh Kumar (Admin)',
    departmentAssignedAt: '2024-01-16T12:00:00Z',
    comments: [
      {
        id: 'C6',
        author: 'Eng. Vikram Singh',
        message: 'AC technician will be on-site tomorrow morning. Temporary cooling arrangements made for today\'s classes.',
        timestamp: '2024-01-19T11:00:00Z',
        role: 'department-head'
      }
    ]
  },
  {
    id: 'COMP-009',
    studentId: 'STU-008',
    studentName: 'Kavitha Nair',
    university: 'Indian Institute of Information Technology (IIIT) Hyderabad',
    category: 'Administration',
    description: 'Fee reimbursement for medical emergency not processed despite submitting all required documents 2 months ago.',
    priority: 'High',
    status: 'Escalated',
    escalationLevel: 2,
    dateSubmitted: '2023-11-15',
    lastUpdated: '2024-01-10',
    daysOpened: 68,
    assignedDepartment: 'administration',
    assignedDepartmentHead: 'Mrs. Sunita Patel',
    departmentAssignedBy: 'Dr. Rajesh Kumar (Admin)',
    departmentAssignedAt: '2023-11-16T10:00:00Z',
    comments: [
      {
        id: 'C7',
        author: 'Mrs. Sunita Patel',
        message: 'This case has been escalated to the Finance Committee for immediate review. We sincerely apologize for the delay.',
        timestamp: '2024-01-10T15:30:00Z',
        role: 'department-head'
      }
    ]
  },
  {
    id: 'COMP-010',
    studentId: 'STU-009',
    studentName: 'Ravi Mehta',
    university: 'Birla Institute of Technology and Science (BITS), Pilani',
    category: 'Mess',
    description: 'Vegetarian food options extremely limited in the evening mess. Request for more variety in vegetarian menu.',
    priority: 'Low',
    status: 'Resolved',
    escalationLevel: 1,
    dateSubmitted: '2024-01-05',
    lastUpdated: '2024-01-20',
    daysOpened: 15,
    assignedDepartment: 'food-services',
    assignedDepartmentHead: 'Dr. Anita Gupta',
    departmentAssignedBy: 'Dr. Rajesh Kumar (Admin)',
    departmentAssignedAt: '2024-01-05T14:00:00Z',
    comments: [
      {
        id: 'C8',
        author: 'Dr. Anita Gupta',
        message: 'Thank you for the feedback. We have added 5 new vegetarian dishes to our evening menu effective from this week.',
        timestamp: '2024-01-20T12:00:00Z',
        role: 'department-head'
      }
    ]
  }
];