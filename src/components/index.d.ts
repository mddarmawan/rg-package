type ApiResponse<T> = T & {
  Response: string;
  Search?: T[];
  Error?: string;
}

interface User {
  username: string;
  role: 'admin' | 'user';
}

interface UserRequest {
  id: string;
  user_id: string;
  delivery_address: string;
  contact_number: string;
  contact_person: string;
  status: 'created' | 'rejected';
  created_at: Date;
}

interface PackageData {
  status: string;
  message: string;
  user: {
    userId: string;
    userName: string;
    userEmail: string;
    userPhoneNumber: string;
  };
  packages: PackageItem[];
}

interface PackageItem {
  packageName: string;
  packageSerial: string;
  packageTag: "englishacademy" | "skillacademy" | "ruangguru";
  orderStatus: string
}
