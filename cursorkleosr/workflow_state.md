# Workflow State - Digital Signage Project

## Current State
**Phase**: IDLE  
**Status**: AWAITING_TASK  
**Last Updated**: Initial Setup  
**Current Task**: None  
**Blocked**: No  
**Context Memory**: Clean slate - ready for first task

## Plan
No active plan. Waiting for user task assignment.

### Next Steps
1. Await user task assignment
2. Enter ANALYZE phase when task received
3. Generate detailed plan in BLUEPRINT phase
4. Request plan approval before CONSTRUCT phase

## Embedded Rules & Workflow

### Global Rules
Act as an expert AI programming assistant focused on producing clear, readable code according to the project's defined language and standards (see `cursorkleosr/project_config.md`). Maintain a thoughtful, nuanced, and accurate reasoning process.

**Task Processing Flow:**
1. **READ**: Always start by reading this `workflow_state.md` to understand current situation
2. **ANALYZE**: Understand the task requirements and project context
3. **BLUEPRINT**: Create detailed implementation plan with pseudocode
4. **CONSTRUCT**: Implement according to approved plan
5. **VALIDATE**: Test and verify implementation
6. **UPDATE**: Record progress and results in this file

### Phase-Specific Rules

#### ANALYZE Phase
- Read user requirements carefully
- Review `project_config.md` for tech stack and patterns
- Identify which files/components need modification
- Note any dependencies or prerequisites
- Set Status to ANALYZING
- Move to BLUEPRINT when analysis complete

#### BLUEPRINT Phase
- Generate detailed step-by-step plan in ## Plan section
- Use pseudocode or clear action descriptions
- Reference specific files and functions to modify
- Consider project patterns from `project_config.md`
- Set Status to NEEDS_PLAN_APPROVAL
- **CRUCIAL**: Wait for user confirmation before proceeding

#### CONSTRUCT Phase
- Follow approved plan exactly
- Generate complete, functional code (NO TODOs or placeholders)
- Include all necessary imports and dependencies
- Follow TypeScript strict mode
- Use TailwindCSS for styling
- Implement proper error handling
- Set Status to IMPLEMENTING
- Update plan with completed steps

#### VALIDATE Phase
- Test implementation thoroughly
- Check for TypeScript errors: `pnpm lint`
- Verify code formatting: `pnpm format`
- Run development server to test: `pnpm dev`
- Set Status to VALIDATING
- Report any issues found

### Tool Usage Rules
- **Terminal Commands**: Use for linting, formatting, building, testing
- **File Operations**: Read files before editing to understand context
- **Code Search**: Use semantic search to find relevant existing code
- **Error Handling**: If linting/formatting fails, fix immediately
- **Performance**: Consider signage-specific performance requirements

### Error Recovery Rules
- **TypeScript Errors**: Fix type issues without changing runtime behavior
- **Lint Errors**: Apply ESLint fixes automatically when safe
- **Build Failures**: Check dependencies and configuration
- **Runtime Errors**: Implement proper error boundaries
- **Memory Issues**: Optimize for long-running signage displays

### Memory Management
- **Context Cleanup**: Clear irrelevant information between major tasks
- **State Persistence**: Maintain current plan and progress
- **Log Rotation**: Keep recent 10 entries, summarize older ones
- **File References**: Track which files have been modified

### Communication Rules
- **Concise Logging**: Brief, factual entries in ## Log section
- **Status Updates**: Clear status changes with reasoning
- **Plan Requests**: Explicit approval requests for plans
- **Error Reporting**: Clear description of issues and proposed fixes

## Log
**[INIT]** Workflow state initialized for signage project. Ready for task assignment. Project configuration loaded with Electron + React + TypeScript + TailwindCSS stack. 