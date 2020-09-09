# AWS Queue Counter
## Example Queuing Counters System

The main goal of the repo is tackle the problems that occur when making concurent reads and writes from a dynamodb table.

With queuing we are ensuring consistency of the records that are updated one after another. 

Using FIFO also insures the order of the passed data.

---

**The repository consists of:**

* bin/queue.ts 
> _Instance of the stack_

* lib/queue-requestor.ts 
> _Send new messages to the queue_

* lib/queue-resolver.ts  
> _Receive messages from queue and write to dynamodb_

* lib/queue-stack.ts     
> _Stack definition an resources needed for lambdas_
