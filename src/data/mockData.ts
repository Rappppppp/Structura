import type { Project, Invoice, TeamMember, ChatRoom, ProjectStatusData, RevenueData, KanbanTask, TimelineEvent, TeamMemberDetailed, Client } from '@/types';

export const projects: Project[] = [
  { id: 'PRJ-001', name: 'Skyline Tower', client: 'Urban Dev Corp', status: 'active', progress: 72, deadline: '2025-06-15', budget: 4500000 },
  { id: 'PRJ-002', name: 'Harbor Bridge Redesign', client: 'City of Portland', status: 'active', progress: 45, deadline: '2025-09-01', budget: 8200000 },
  { id: 'PRJ-003', name: 'Green Campus Hub', client: 'State University', status: 'review', progress: 91, deadline: '2025-03-20', budget: 3100000 },
  { id: 'PRJ-004', name: 'Metro Station Complex', client: 'Transit Authority', status: 'active', progress: 33, deadline: '2025-12-01', budget: 12000000 },
  { id: 'PRJ-005', name: 'Riverside Apartments', client: 'Horizon Realty', status: 'completed', progress: 100, deadline: '2025-01-15', budget: 6700000 },
  { id: 'PRJ-006', name: 'Innovation Lab', client: 'TechForward Inc', status: 'on-hold', progress: 18, deadline: '2025-11-30', budget: 2200000 },
];

export const invoices: Invoice[] = [
  { id: 'INV-001', project: 'Skyline Tower', client: 'Urban Dev Corp', amount: 450000, status: 'paid', dueDate: '2025-02-01' },
  { id: 'INV-002', project: 'Harbor Bridge Redesign', client: 'City of Portland', amount: 820000, status: 'pending', dueDate: '2025-03-15' },
  { id: 'INV-003', project: 'Green Campus Hub', client: 'State University', amount: 155000, status: 'overdue', dueDate: '2025-01-20' },
  { id: 'INV-004', project: 'Metro Station Complex', client: 'Transit Authority', amount: 1200000, status: 'pending', dueDate: '2025-04-01' },
  { id: 'INV-005', project: 'Riverside Apartments', client: 'Horizon Realty', amount: 670000, status: 'paid', dueDate: '2025-01-10' },
];

export const teamMembers: TeamMember[] = [
  { name: 'Sarah Chen', role: 'Lead Architect', avatar: 'SC', projects: 3 },
  { name: 'James Wilson', role: 'Structural Engineer', avatar: 'JW', projects: 2 },
  { name: 'Emily Davis', role: 'Interior Designer', avatar: 'ED', projects: 4 },
  { name: 'David Park', role: 'Project Manager', avatar: 'DP', projects: 5 },
  { name: 'Lisa Thompson', role: 'MEP Engineer', avatar: 'LT', projects: 2 },
];

export const chatRooms: ChatRoom[] = [
  { id: 1, name: 'Skyline Tower — General', lastMessage: 'Updated the facade renderings', time: '2 min ago', unread: 3 },
  { id: 2, name: 'Harbor Bridge — Design', lastMessage: 'Structural analysis ready for review', time: '15 min ago', unread: 1 },
  { id: 3, name: 'Green Campus — Client', lastMessage: 'Approved the landscape plan', time: '1 hr ago', unread: 0 },
  { id: 4, name: 'Metro Station — Engineering', lastMessage: 'Load calculations attached', time: '3 hr ago', unread: 5 },
];

export const projectStatusData: ProjectStatusData[] = [
  { month: 'Sep', active: 4, completed: 1, onHold: 1 },
  { month: 'Oct', active: 5, completed: 2, onHold: 1 },
  { month: 'Nov', active: 6, completed: 2, onHold: 2 },
  { month: 'Dec', active: 5, completed: 3, onHold: 1 },
  { month: 'Jan', active: 4, completed: 4, onHold: 1 },
  { month: 'Feb', active: 6, completed: 5, onHold: 1 },
];

export const revenueData: RevenueData[] = [
  { month: 'Sep', revenue: 1200000, expenses: 800000 },
  { month: 'Oct', revenue: 1450000, expenses: 920000 },
  { month: 'Nov', revenue: 1100000, expenses: 780000 },
  { month: 'Dec', revenue: 1650000, expenses: 1050000 },
  { month: 'Jan', revenue: 1380000, expenses: 890000 },
  { month: 'Feb', revenue: 1520000, expenses: 960000 },
];

export const kanbanTasks: KanbanTask[] = [
  { id: 1, title: 'Foundation survey report', status: 'done', priority: 'high', assignee: 'JW' },
  { id: 2, title: 'Electrical layout — Floor 3', status: 'in-progress', priority: 'medium', assignee: 'LT' },
  { id: 3, title: 'Client presentation deck', status: 'in-progress', priority: 'high', assignee: 'SC' },
  { id: 4, title: 'Fire safety compliance check', status: 'todo', priority: 'high', assignee: 'DP' },
  { id: 5, title: 'Interior material selection', status: 'todo', priority: 'low', assignee: 'ED' },
  { id: 6, title: 'Roof drainage design', status: 'in-progress', priority: 'medium', assignee: 'JW' },
  { id: 7, title: 'Permit application submission', status: 'todo', priority: 'high', assignee: 'DP' },
  { id: 8, title: 'Landscape concept review', status: 'done', priority: 'low', assignee: 'ED' },
];

export const timelineEvents: TimelineEvent[] = [
  { date: 'Feb 8', title: 'Facade design approved', description: 'Client signed off on the updated facade renderings' },
  { date: 'Feb 5', title: 'Structural review complete', description: 'All load-bearing calculations verified' },
  { date: 'Feb 1', title: 'Phase 2 kicked off', description: 'Interior design and MEP planning initiated' },
  { date: 'Jan 28', title: 'Foundation completed', description: 'On-site foundation work finished ahead of schedule' },
  { date: 'Jan 20', title: 'Permits approved', description: 'City planning board granted all required permits' },
];

export const teamMembersDetailed: TeamMemberDetailed[] = [
  { id: 1, name: 'Sarah Chen', role: 'Lead Architect', avatar: 'SC', email: 'sarah.chen@structura.com', phone: '(555) 101-2001', projects: 3, assignedProjects: ['Skyline Tower', 'Harbor Bridge', 'Green Campus'] },
  { id: 2, name: 'James Wilson', role: 'Structural Engineer', avatar: 'JW', email: 'james.wilson@structura.com', phone: '(555) 101-2002', projects: 2, assignedProjects: ['Skyline Tower', 'Metro Station'] },
  { id: 3, name: 'Emily Davis', role: 'Interior Designer', avatar: 'ED', email: 'emily.davis@structura.com', phone: '(555) 101-2003', projects: 4, assignedProjects: ['Skyline Tower', 'Riverside Apts', 'Green Campus', 'Innovation Lab'] },
  { id: 4, name: 'David Park', role: 'Project Manager', avatar: 'DP', email: 'david.park@structura.com', phone: '(555) 101-2004', projects: 5, assignedProjects: ['Skyline Tower', 'Harbor Bridge', 'Metro Station', 'Green Campus', 'Riverside Apts'] },
  { id: 5, name: 'Lisa Thompson', role: 'MEP Engineer', avatar: 'LT', email: 'lisa.thompson@structura.com', phone: '(555) 101-2005', projects: 2, assignedProjects: ['Metro Station', 'Innovation Lab'] },
  { id: 6, name: 'Robert Kim', role: 'Civil Engineer', avatar: 'RK', email: 'robert.kim@structura.com', phone: '(555) 101-2006', projects: 3, assignedProjects: ['Harbor Bridge', 'Metro Station', 'Skyline Tower'] },
  { id: 7, name: 'Maria Garcia', role: 'Landscape Architect', avatar: 'MG', email: 'maria.garcia@structura.com', phone: '(555) 101-2007', projects: 2, assignedProjects: ['Green Campus', 'Riverside Apts'] },
  { id: 8, name: 'Tom Bennett', role: 'BIM Specialist', avatar: 'TB', email: 'tom.bennett@structura.com', phone: '(555) 101-2008', projects: 4, assignedProjects: ['Skyline Tower', 'Harbor Bridge', 'Metro Station', 'Innovation Lab'] },
];

export const clients: Client[] = [
  { id: 1, name: 'Urban Dev Corp', industry: 'Real Estate Development', contactPerson: 'Michael Roberts', email: 'mroberts@urbandev.com', phone: '(555) 200-1001', location: 'New York, NY', activeProjects: 1, totalValue: 4500000, status: 'active', projects: ['Skyline Tower'] },
  { id: 2, name: 'City of Portland', industry: 'Government', contactPerson: 'Jennifer Walsh', email: 'jwalsh@portland.gov', phone: '(555) 200-1002', location: 'Portland, OR', activeProjects: 1, totalValue: 8200000, status: 'active', projects: ['Harbor Bridge Redesign'] },
  { id: 3, name: 'State University', industry: 'Education', contactPerson: 'Dr. Alan Foster', email: 'afoster@stateuniv.edu', phone: '(555) 200-1003', location: 'Austin, TX', activeProjects: 1, totalValue: 3100000, status: 'review', projects: ['Green Campus Hub'] },
  { id: 4, name: 'Transit Authority', industry: 'Government / Transportation', contactPerson: 'Karen Liu', email: 'kliu@transitauth.gov', phone: '(555) 200-1004', location: 'Chicago, IL', activeProjects: 1, totalValue: 12000000, status: 'active', projects: ['Metro Station Complex'] },
  { id: 5, name: 'Horizon Realty', industry: 'Real Estate', contactPerson: 'Steven Nash', email: 'snash@horizonrealty.com', phone: '(555) 200-1005', location: 'Denver, CO', activeProjects: 0, totalValue: 6700000, status: 'completed', projects: ['Riverside Apartments'] },
  { id: 6, name: 'TechForward Inc', industry: 'Technology', contactPerson: 'Diana Patel', email: 'dpatel@techforward.com', phone: '(555) 200-1006', location: 'San Francisco, CA', activeProjects: 0, totalValue: 2200000, status: 'on-hold', projects: ['Innovation Lab'] },
];
