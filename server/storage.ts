import { 
  users, 
  testProjects, 
  type User, 
  type InsertUser, 
  type TestProject, 
  type InsertTestProject 
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // TestProject operations
  createTestProject(project: InsertTestProject): Promise<TestProject>;
  getTestProject(id: number): Promise<TestProject | undefined>;
  getUserTestProjects(userId: number): Promise<TestProject[]>;
  updateTestProject(id: number, project: Partial<InsertTestProject>): Promise<TestProject | undefined>;
  deleteTestProject(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private testProjects: Map<number, TestProject>;
  private userIdCounter: number;
  private testProjectIdCounter: number;

  constructor() {
    this.users = new Map();
    this.testProjects = new Map();
    this.userIdCounter = 1;
    this.testProjectIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // TestProject methods
  async createTestProject(project: InsertTestProject): Promise<TestProject> {
    const id = this.testProjectIdCounter++;
    const createdAt = new Date();
    
    // Ensure all required fields are properly set
    const newProject: TestProject = {
      id,
      userId: project.userId ?? null,
      title: project.title,
      createdAt,
      requirements: project.requirements,
      testCases: project.testCases,
      includeEdgeCases: project.includeEdgeCases ?? true,
      includeNegativeTests: project.includeNegativeTests ?? true,
      includePerformanceTests: project.includePerformanceTests ?? false
    };
    
    this.testProjects.set(id, newProject);
    return newProject;
  }

  async getTestProject(id: number): Promise<TestProject | undefined> {
    return this.testProjects.get(id);
  }

  async getUserTestProjects(userId: number): Promise<TestProject[]> {
    return Array.from(this.testProjects.values()).filter(
      (project) => project.userId === userId
    );
  }

  async updateTestProject(id: number, project: Partial<InsertTestProject>): Promise<TestProject | undefined> {
    const existingProject = this.testProjects.get(id);
    if (!existingProject) return undefined;
    
    // Create a properly typed updated project
    const updatedProject: TestProject = { 
      ...existingProject,
      title: project.title ?? existingProject.title,
      userId: project.userId ?? existingProject.userId,
      requirements: project.requirements ?? existingProject.requirements,
      testCases: project.testCases ?? existingProject.testCases,
      includeEdgeCases: project.includeEdgeCases ?? existingProject.includeEdgeCases,
      includeNegativeTests: project.includeNegativeTests ?? existingProject.includeNegativeTests,
      includePerformanceTests: project.includePerformanceTests ?? existingProject.includePerformanceTests
    };
    
    this.testProjects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteTestProject(id: number): Promise<boolean> {
    return this.testProjects.delete(id);
  }
}

export const storage = new MemStorage();
