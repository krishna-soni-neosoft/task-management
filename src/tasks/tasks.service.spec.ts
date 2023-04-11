import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
// import { Repository } from 'typeorm';
// import { Task } from './task.entity';
// import { User } from '../auth/user.entity';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
});

const mockUser = {
  username: 'Krishna',
  id: 'someId',
  password: 'somePassword',
  tasks: [],
};
describe('Task Service', () => {
  let tasksService: TasksService;
  //   let tasksRepository: Repository<Task>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        // { provide: Repository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = await module.get(TasksService);
    // tasksRepository = await module.get(Repository);
  });

  describe('getTasks', () => {
    it('calls TaskRepository.getTasks and return result', () => {
      expect(tasksService.getTasks).not.toHaveBeenCalled();

      tasksService.getTasks(null, mockUser);
    });
  });
});
