---
slug: ring-strategy
term: ring strategy
aliases:
  - ring strategies
  - ring distribution
short: How a queue or ring group decides which member to ring when a call arrives. Ring groups support Ring All, Ring Sequentially, Memory Hunt, Custom. Queues add Linear, Least Recent, Fewest Calls, Round Robin Memory, and Skill-Based.
related:
  - ring-group
  - queue
tags: [yeastar, queues, ring-groups]
---

Ring strategy is the answer to "we have multiple people who can take this call, which one rings first?". The right pick depends on the team's structure and the customer's fairness requirements:

- **Ring All** rings everyone simultaneously, first to pick up wins. Simple, good for small workgroups where any member can answer.
- **Linear** rings agent 1, then 2, then 3, in fixed list order. Top of list gets all the calls until they're busy.
- **Ring Sequentially** is the ring-group equivalent of Linear: ring member 1 for the timeout, then member 2, etc.
- **Memory Hunt** rings member 1 first; on timeout, rings 1 AND 2; then 1, 2 AND 3; etc. Cumulative pile-on.
- **Custom** lets each member have their own ring Delay and Ring Timeout. Builds staggered patterns ("Alice rings immediately, Bob 5 seconds later, Carol 10 seconds after that").
- **Least Recent** picks the agent idle longest. Fair distribution for non-specialised teams.
- **Fewest Calls** picks the agent with fewest answered calls today. Workload balancing.
- **Round Robin Memory** rotates through agents, remembering the position.
- **Skill-Based** routes to agents whose skill levels match the queue's required skills. For multi-skill queues where different calls need different expertise.
