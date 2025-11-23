export const COMPLAINT_CATEGORIES = ['Academics', 'Hostel', 'Mess', 'Facilities', 'Administration', 'Other'] as const;

export const COMPLAINT_STATUSES = ['Pending', 'In Progress', 'Resolved', 'Escalated'] as const;

export const COMPLAINT_PRIORITIES = ['High', 'Medium', 'Low'] as const;

export const ESCALATION_LEVELS = {
  1: 'Faculty Level',
  2: 'HOD Level', 
  3: 'Dean Level'
} as const;

export const STATUS_COLORS = {
  'Pending': '#FF8C00',
  'In Progress': '#17A2B8', 
  'Resolved': '#28A745',
  'Escalated': '#DC3545'
} as const;

export const PRIORITY_COLORS = {
  'High': 'text-red-600 bg-red-50',
  'Medium': 'text-yellow-600 bg-yellow-50',
  'Low': 'text-green-600 bg-green-50'
} as const;

export const CHART_COLORS = ['#2F5DCE', '#FF8C00', '#28A745', '#DC3545', '#17A2B8', '#6F42C1'];

// Department Head System
export const DEPARTMENTS = {
  'academics': {
    name: 'Academic Affairs',
    head: 'Dr. Priya Sharma',
    email: 'academic.head@university.in',
    phone: '+91-11-2659-1234',
    categories: ['Academics'],
    description: 'Handles all academic-related complaints including course content, examination issues, and faculty concerns'
  },
  'student-affairs': {
    name: 'Student Affairs & Hostel Management',
    head: 'Prof. Rajesh Kumar',
    email: 'student.affairs@university.in',
    phone: '+91-11-2659-1235',
    categories: ['Hostel'],
    description: 'Manages hostel facilities, student accommodation, and residential life issues'
  },
  'food-services': {
    name: 'Food Services & Mess Committee',
    head: 'Dr. Anita Gupta',
    email: 'mess.committee@university.in',
    phone: '+91-11-2659-1236',
    categories: ['Mess'],
    description: 'Oversees dining hall operations, food quality, and nutrition services'
  },
  'facilities': {
    name: 'Facilities Management & Infrastructure',
    head: 'Eng. Vikram Singh',
    email: 'facilities@university.in',
    phone: '+91-11-2659-1237',
    categories: ['Facilities'],
    description: 'Handles campus infrastructure, maintenance, utilities, and facility upgrades'
  },
  'administration': {
    name: 'Administrative Services',
    head: 'Mrs. Sunita Patel',
    email: 'admin.services@university.in',
    phone: '+91-11-2659-1238',
    categories: ['Administration'],
    description: 'Manages administrative processes, documentation, and bureaucratic procedures'
  },
  'general': {
    name: 'General Administration',
    head: 'Dr. Manoj Verma',
    email: 'general.admin@university.in',
    phone: '+91-11-2659-1239',
    categories: ['Other'],
    description: 'Handles miscellaneous complaints and coordinates with other departments'
  }
} as const;

// Department assignment based on complaint category
export const CATEGORY_TO_DEPARTMENT = {
  'Academics': 'academics',
  'Hostel': 'student-affairs',
  'Mess': 'food-services',
  'Facilities': 'facilities',
  'Administration': 'administration',
  'Other': 'general'
} as const;

export const DEPARTMENT_COLORS = {
  'academics': 'bg-blue-100 text-blue-800 border-blue-200',
  'student-affairs': 'bg-purple-100 text-purple-800 border-purple-200',
  'food-services': 'bg-green-100 text-green-800 border-green-200',
  'facilities': 'bg-orange-100 text-orange-800 border-orange-200',
  'administration': 'bg-red-100 text-red-800 border-red-200',
  'general': 'bg-gray-100 text-gray-800 border-gray-200'
} as const;

// Comprehensive list of Indian Universities organized by categories (duplicates removed)
export const INDIAN_UNIVERSITIES = {
  // Central Universities (Government)
  'Central Universities': [
    'University of Delhi',
    'Jawaharlal Nehru University (JNU), New Delhi',
    'Jamia Millia Islamia, New Delhi',
    'Aligarh Muslim University (AMU)',
    'Banaras Hindu University (BHU)',
    'University of Hyderabad',
    'Pondicherry University',
    'Tezpur University',
    'North Eastern Hill University (NEHU), Shillong',
    'Assam University, Silchar',
    'Manipur University',
    'Mizoram University',
    'Nagaland University',
    'Tripura University',
    'Sikkim University',
    'Rajiv Gandhi University, Arunachal Pradesh',
    'Central University of Jammu',
    'Central University of Kashmir',
    'Central University of Punjab',
    'Central University of Haryana',
    'Central University of Himachal Pradesh',
    'Central University of Rajasthan',
    'Central University of Gujarat',
    'Central University of Karnataka',
    'Central University of Kerala',
    'Central University of Tamil Nadu',
    'Central University of Andhra Pradesh',
    'Central University of Odisha',
    'Central University of Jharkhand',
    'Central University of Bihar',
    'Central University of South Bihar',
    'Mahatma Gandhi Central University, Bihar',
    'Dr. Harisingh Gour Central University, Madhya Pradesh',
    'Hemvati Nandan Bahuguna Garhwal University',
    'Babasaheb Bhimrao Ambedkar University, Lucknow'
  ],

  // Institutes of National Importance
  'IITs & IIMs': [
    'Indian Institute of Technology (IIT) Delhi',
    'Indian Institute of Technology (IIT) Bombay',
    'Indian Institute of Technology (IIT) Madras',
    'Indian Institute of Technology (IIT) Kanpur',
    'Indian Institute of Technology (IIT) Kharagpur',
    'Indian Institute of Technology (IIT) Roorkee',
    'Indian Institute of Technology (IIT) Guwahati',
    'Indian Institute of Technology (IIT) Hyderabad',
    'Indian Institute of Technology (IIT) Gandhinagar',
    'Indian Institute of Technology (IIT) Patna',
    'Indian Institute of Technology (IIT) Ropar',
    'Indian Institute of Technology (IIT) Bhubaneswar',
    'Indian Institute of Technology (IIT) Indore',
    'Indian Institute of Technology (IIT) Mandi',
    'Indian Institute of Technology (IIT) Jodhpur',
    'Indian Institute of Technology (IIT) Varanasi (BHU)',
    'Indian Institute of Technology (IIT) Palakkad',
    'Indian Institute of Technology (IIT) Tirupati',
    'Indian Institute of Technology (IIT) Dhanbad',
    'Indian Institute of Technology (IIT) Bhilai',
    'Indian Institute of Technology (IIT) Goa',
    'Indian Institute of Technology (IIT) Jammu',
    'Indian Institute of Technology (IIT) Dharwad',
    'Indian Institute of Management (IIM) Ahmedabad',
    'Indian Institute of Management (IIM) Bangalore',
    'Indian Institute of Management (IIM) Calcutta',
    'Indian Institute of Management (IIM) Lucknow',
    'Indian Institute of Management (IIM) Indore',
    'Indian Institute of Management (IIM) Kozhikode',
    'Indian Institute of Management (IIM) Shillong',
    'Indian Institute of Management (IIM) Rohtak',
    'Indian Institute of Management (IIM) Ranchi',
    'Indian Institute of Management (IIM) Raipur',
    'Indian Institute of Management (IIM) Trichy',
    'Indian Institute of Management (IIM) Udaipur',
    'Indian Institute of Management (IIM) Kashipur',
    'Indian Institute of Management (IIM) Nagpur',
    'Indian Institute of Management (IIM) Visakhapatnam',
    'Indian Institute of Management (IIM) Amritsar',
    'Indian Institute of Management (IIM) Bodh Gaya',
    'Indian Institute of Management (IIM) Jammu',
    'Indian Institute of Management (IIM) Sambalpur',
    'Indian Institute of Management (IIM) Sirmaur'
  ],

  'NITs & IIITs': [
    'National Institute of Technology (NIT) Trichy',
    'National Institute of Technology (NIT) Warangal',
    'National Institute of Technology (NIT) Surathkal',
    'National Institute of Technology (NIT) Calicut',
    'National Institute of Technology (NIT) Rourkela',
    'National Institute of Technology (NIT) Kurukshetra',
    'National Institute of Technology (NIT) Jaipur',
    'National Institute of Technology (NIT) Nagpur',
    'National Institute of Technology (NIT) Allahabad',
    'National Institute of Technology (NIT) Bhopal',
    'National Institute of Technology (NIT) Patna',
    'National Institute of Technology (NIT) Jalandhar',
    'National Institute of Technology (NIT) Durgapur',
    'National Institute of Technology (NIT) Jamshedpur',
    'National Institute of Technology (NIT) Hamirpur',
    'National Institute of Technology (NIT) Silchar',
    'National Institute of Technology (NIT) Agartala',
    'National Institute of Technology (NIT) Arunachal Pradesh',
    'National Institute of Technology (NIT) Delhi',
    'National Institute of Technology (NIT) Goa',
    'National Institute of Technology (NIT) Manipur',
    'National Institute of Technology (NIT) Meghalaya',
    'National Institute of Technology (NIT) Mizoram',
    'National Institute of Technology (NIT) Nagaland',
    'National Institute of Technology (NIT) Sikkim',
    'National Institute of Technology (NIT) Uttarakhand',
    'National Institute of Technology (NIT) Andhra Pradesh',
    'National Institute of Technology (NIT) Puducherry',
    'Indian Institute of Information Technology (IIIT) Hyderabad',
    'Indian Institute of Information Technology (IIIT) Allahabad',
    'Indian Institute of Information Technology (IIIT) Gwalior',
    'Indian Institute of Information Technology (IIIT) Jabalpur',
    'Indian Institute of Information Technology (IIIT) Kota',
    'Indian Institute of Information Technology (IIIT) Vadodara',
    'Indian Institute of Information Technology (IIIT) Nagpur',
    'Indian Institute of Information Technology (IIIT) Pune',
    'Indian Institute of Information Technology (IIIT) Kurnool',
    'Indian Institute of Information Technology (IIIT) Tiruchirappalli',
    'Indian Institute of Information Technology (IIIT) Una',
    'Indian Institute of Information Technology (IIIT) Surat',
    'Indian Institute of Information Technology (IIIT) Manipur',
    'Indian Institute of Information Technology (IIIT) Kalyani',
    'Indian Institute of Information Technology (IIIT) Lucknow',
    'Indian Institute of Information Technology (IIIT) Dharwad',
    'Indian Institute of Information Technology (IIIT) Bhagalpur',
    'Indian Institute of Information Technology (IIIT) Bhopal',
    'Indian Institute of Information Technology (IIIT) Kottayam',
    'Indian Institute of Information Technology (IIIT) Ranchi',
    'Indian Institute of Information Technology (IIIT) Sonepat',
    'Indian Institute of Information Technology (IIIT) Agartala'
  ],

  // Major State Universities (Government)
  'State Universities': [
    'University of Mumbai',
    'University of Calcutta',
    'University of Madras',
    'University of Pune',
    'Anna University, Chennai',
    'Osmania University, Hyderabad',
    'Andhra University, Visakhapatnam',
    'Kakatiya University, Warangal',
    'Sri Venkateswara University, Tirupati',
    'Acharya Nagarjuna University',
    'Bangalore University',
    'Karnataka University, Dharwad',
    'Mysore University',
    'Kuvempu University',
    'Mangalore University',
    'Gulbarga University',
    'Kerala University, Thiruvananthapuram',
    'Cochin University of Science and Technology',
    'Mahatma Gandhi University, Kottayam',
    'Calicut University',
    'Kannur University',
    'Bharathiar University, Coimbatore',
    'Bharathidasan University, Tiruchirappalli',
    'Madurai Kamaraj University',
    'Annamalai University',
    'Tamil Nadu Agricultural University',
    'Gujarat University, Ahmedabad',
    'Maharaja Sayajirao University, Vadodara',
    'Saurashtra University, Rajkot',
    'South Gujarat University, Surat',
    'Sardar Patel University, Vallabh Vidyanagar',
    'Rajasthan University, Jaipur',
    'Maharshi Dayanand Saraswati University, Ajmer',
    'Jai Narain Vyas University, Jodhpur',
    'Mohanlal Sukhadia University, Udaipur',
    'Kurukshetra University',
    'Maharshi Dayanand University, Rohtak',
    'Chaudhary Charan Singh University, Meerut',
    'Dr. A.P.J. Abdul Kalam Technical University, Lucknow',
    'Lucknow University',
    'Gorakhpur University',
    'Allahabad University',
    'Kanpur University',
    'Agra University',
    'Rohilkhand University, Bareilly',
    'Bundelkhand University, Jhansi',
    'Ranchi University',
    'Magadh University, Bodh Gaya',
    'Patna University',
    'Bihar University, Muzaffarpur',
    'Lalit Narayan Mithila University, Darbhanga',
    'Aryabhatta Knowledge University, Patna',
    'Utkal University, Bhubaneswar',
    'Berhampur University',
    'Sambalpur University',
    'North Orissa University, Baripada',
    'Punjabi University, Patiala',
    'Guru Nanak Dev University, Amritsar',
    'Panjab University, Chandigarh',
    'Himachal Pradesh University, Shimla',
    'Kumaon University, Nainital',
    'Garhwal University, Srinagar'
  ],

  // Deemed Universities (Semi-government/Private) - REMOVED DUPLICATES
  'Deemed Universities': [
    'Indian Statistical Institute (ISI)',
    'Indian Institute of Science (IISc), Bangalore',
    'Tata Institute of Fundamental Research (TIFR), Mumbai',
    'Vishva-Bharati University, Santiniketan',
    'Jamia Hamdard, New Delhi',
    'TERI School of Advanced Studies, New Delhi',
    'Dayalbagh Educational Institute, Agra',
    'Allahabad Agricultural Institute',
    'Forest Research Institute, Dehradun',
    'Indian Agricultural Research Institute, New Delhi',
    'National Dairy Research Institute, Karnal',
    'Central Institute of Fisheries Education, Mumbai',
    'Birla Institute of Technology and Science (BITS), Pilani',
    'Manipal Academy of Higher Education',
    'VIT University, Vellore',
    'SRM Institute of Science and Technology',
    'Amrita Vishwa Vidyapeetham',
    'Bharati Vidyapeeth, Pune',
    'Dr. D.Y. Patil Vidyapeeth, Pune',
    'Symbiosis International University, Pune',
    'MIT World Peace University, Pune',
    'Lovely Professional University (LPU), Punjab',
    'Thapar Institute of Engineering and Technology',
    'Shoolini University, Himachal Pradesh',
    'Graphic Era University, Dehradun',
    'Uttaranchal University, Dehradun',
    'Doon University, Dehradun',
    'Jaypee Institute of Information Technology',
    'Amity University, Noida',
    'Sharda University, Greater Noida',
    'Bennett University, Greater Noida',
    'Galgotias University, Greater Noida',
    'KIIT University, Bhubaneswar',
    'Siksha O Anusandhan University, Bhubaneswar',
    'Kalinga Institute of Industrial Technology',
    'Xavier University, Bhubaneswar',
    'ICFAI Foundation for Higher Education, Hyderabad',
    'Koneru Lakshmaiah Education Foundation',
    'Vignan University, Andhra Pradesh',
    'SRM University, Andhra Pradesh',
    'Gitam University, Visakhapatnam',
    'CMR University, Bangalore',
    'PES University, Bangalore',
    'Ramaiah University of Applied Sciences',
    'RV University, Bangalore',
    'Jain University, Bangalore',
    'Christ University, Bangalore',
    'Azim Premji University, Bangalore',
    'Alliance University, Bangalore',
    'Reva University, Bangalore',
    'Karunya Institute of Technology and Sciences',
    'Kalasalingam Academy of Research and Education',
    'Hindustan Institute of Technology and Science',
    'Sathyabama Institute of Science and Technology',
    'Vel Tech Rangarajan Dr. Sagunthala R&D Institute',
    'B.S. Abdur Rahman Crescent Institute of Science and Technology'
  ],

  // Major Private Universities - ENHANCED WITH COMPREHENSIVE HARYANA UNIVERSITIES
  'Private Universities': [
    // Haryana Private Universities - Comprehensive List
    'Ashoka University, Haryana',
    'O.P. Jindal Global University, Haryana',
    'BML Munjal University, Haryana',
    'Manav Rachna International Institute of Research and Studies, Faridabad',
    'The NorthCap University, Gurugram',
    'Ansal University, Gurgaon',
    'Apeejay Stya University, Gurugram',
    'GD Goenka University, Gurugram',
    'IIMT University, Meerut',
    'K.R. Mangalam University, Gurugram',
    'Lingaya\'s Vidyapeeth, Faridabad',
    'PDM University, Bahadurgarh',
    'SGT University, Gurugram',
    'Starex University, Gurugram',
    'World University of Design, Sonipat',
    'YBN University, Ranchi',
    'Amity University, Gurugram',
    'Sharda University, Greater Noida',
    'Bennett University, Greater Noida',
    'Galgotias University, Greater Noida',
    'Jindal School of Government and Public Policy',
    'Plaksha University, Punjab',
    'Shiv Nadar University, Greater Noida',
    'Flame University, Pune',
    'Indian School of Business (ISB), Hyderabad',
    'Great Lakes Institute of Management',
    'SP Jain School of Global Management',
    'NMIMS University, Mumbai',
    'Mukesh Patel School of Technology Management',
    'K.J. Somaiya University, Mumbai',
    'Rai University, Ahmedabad',
    'Parul University, Gujarat',
    'Navrachana University, Gujarat',
    'Marwadi University, Gujarat',
    'RK University, Gujarat',
    'ITM University, Gwalior',
    'Maharishi University of Information Technology',
    'Oriental University, Indore',
    'Prestige Institute of Management and Research',
    'Sandip University, Maharashtra',
    'MIT Academy of Engineering, Pune',
    'Sinhgad Technical Education Society',
    'Poona Institute of Management Sciences',
    'DY Patil International University',
    'Tilak Maharashtra Vidyapeeth, Pune',
    'Deccan College of Engineering and Technology',
    'Karnavati University, Gujarat',
    'Indrashil University, Gujarat',
    'Auro University, Gujarat',
    'Charotar University of Science and Technology',
    'Ganpat University, Gujarat',
    'Pandit Deendayal Petroleum University',
    'Nirma University, Ahmedabad',
    'Adani University, Gujarat',
    'New Horizon University, Bangalore',
    'Garden City University, Bangalore',
    'Presidency University, Bangalore',
    'Dayananda Sagar University, Bangalore',
    'BNM Institute of Technology',
    'East West Institute of Technology'
  ]
} as const;

// Flatten all universities into a single searchable array
export const UNIVERSITIES = [
  ...Object.values(INDIAN_UNIVERSITIES).flat(),
  'Other Indian University',
  'International University'
] as const;

export const ALLOWED_FILE_TYPES = {
  'image/jpeg': { extensions: ['.jpg', '.jpeg'], maxSize: 5 * 1024 * 1024 }, // 5MB
  'image/png': { extensions: ['.png'], maxSize: 5 * 1024 * 1024 }, // 5MB
  'image/gif': { extensions: ['.gif'], maxSize: 5 * 1024 * 1024 }, // 5MB
  'application/pdf': { extensions: ['.pdf'], maxSize: 10 * 1024 * 1024 }, // 10MB
  'application/msword': { extensions: ['.doc'], maxSize: 10 * 1024 * 1024 }, // 10MB
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { extensions: ['.docx'], maxSize: 10 * 1024 * 1024 }, // 10MB
  'text/plain': { extensions: ['.txt'], maxSize: 1 * 1024 * 1024 }, // 1MB
} as const;

export const MAX_FILES_PER_COMPLAINT = 5;
export const MAX_TOTAL_FILE_SIZE = 25 * 1024 * 1024; // 25MB total

// Indian cities for location context
export const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
  'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Bhopal', 'Visakhapatnam', 'Patna',
  'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot',
  'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad',
  'Howrah', 'Ranchi', 'Gwalior', 'Jabalpur', 'Coimbatore', 'Vijayawada', 'Jodhpur', 'Madurai',
  'Raipur', 'Kota', 'Chandigarh', 'Guwahati', 'Solapur', 'Hubli-Dharwad', 'Tiruchirappalli',
  'Bareilly', 'Mysore', 'Tiruppur', 'Gurgaon', 'Aligarh', 'Jalandhar', 'Bhubaneswar', 'Salem',
  'Warangal', 'Guntur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur', 'Bikaner', 'Amravati', 'Noida',
  'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun',
  'Durgapur', 'Asansol', 'Rourkela', 'Nanded', 'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga'
] as const;

// Common Indian names for mock data
export const INDIAN_NAMES = {
  male: [
    'Rahul Sharma', 'Amit Kumar', 'Sanjay Patel', 'Rajesh Singh', 'Vikash Gupta',
    'Arjun Reddy', 'Karan Mehta', 'Rohit Verma', 'Ankit Jain', 'Deepak Yadav',
    'Suresh Kumar', 'Manoj Singh', 'Anil Sharma', 'Ravi Kumar', 'Santosh Patel',
    'Naveen Kumar', 'Ajay Singh', 'Vinod Kumar', 'Prakash Sharma', 'Ashok Kumar',
    'Ramesh Gupta', 'Mahesh Patel', 'Dinesh Kumar', 'Pankaj Sharma', 'Sachin Kumar'
  ],
  female: [
    'Priya Sharma', 'Anjali Singh', 'Neha Patel', 'Pooja Gupta', 'Ritu Kumar',
    'Kavita Reddy', 'Sunita Mehta', 'Meera Verma', 'Sonia Jain', 'Rekha Yadav',
    'Geeta Sharma', 'Seema Singh', 'Anita Patel', 'Radha Kumar', 'Sushma Gupta',
    'Nisha Sharma', 'Asha Singh', 'Uma Patel', 'Lata Kumar', 'Kamala Reddy',
    'Sudha Mehta', 'Vandana Verma', 'Kiran Jain', 'Manju Yadav', 'Savita Kumar'
  ]
} as const;