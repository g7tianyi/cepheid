.PHONY: help install build clean dev test typecheck lint publish publish-dry link unlink version-patch version-minor version-major git-setup git-push npm-check npm-login pack inspect all

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

##@ Help

help: ## Display this help message
	@echo "$(BLUE)Cepheid - CLI tool to manage Claude Code settings$(NC)"
	@echo ""
	@echo "$(GREEN)Usage:$(NC)"
	@echo "  make $(YELLOW)<target>$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf ""} /^[a-zA-Z_-]+:.*?##/ { printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(BLUE)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development

install: ## Install dependencies
	@echo "$(BLUE)Installing dependencies...$(NC)"
	npm install
	@echo "$(GREEN)✓ Dependencies installed$(NC)"

build: clean ## Build the project
	@echo "$(BLUE)Building TypeScript...$(NC)"
	npm run build
	@echo "$(GREEN)✓ Build complete$(NC)"

clean: ## Clean build artifacts
	@echo "$(BLUE)Cleaning build artifacts...$(NC)"
	rm -rf dist/
	rm -f *.tgz
	@echo "$(GREEN)✓ Clean complete$(NC)"

dev: ## Start development mode (watch)
	@echo "$(BLUE)Starting development mode...$(NC)"
	npm run dev

typecheck: ## Run TypeScript type checking
	@echo "$(BLUE)Running type check...$(NC)"
	npm run typecheck
	@echo "$(GREEN)✓ Type check passed$(NC)"

lint: typecheck ## Run linting (currently just typecheck)
	@echo "$(GREEN)✓ All checks passed$(NC)"

##@ Testing

test: build ## Build and run tests locally
	@echo "$(BLUE)Testing CLI commands...$(NC)"
	@node dist/cli.js --version
	@node dist/cli.js skills list
	@node dist/cli.js permissions list
	@echo "$(GREEN)✓ Basic tests passed$(NC)"

link: build ## Link package globally for local testing
	@echo "$(BLUE)Linking package globally...$(NC)"
	npm link
	@echo "$(GREEN)✓ Package linked$(NC)"
	@echo "$(YELLOW)You can now run: cepheid --help$(NC)"

unlink: ## Unlink global package
	@echo "$(BLUE)Unlinking package...$(NC)"
	npm unlink -g cepheid 2>/dev/null || true
	@echo "$(GREEN)✓ Package unlinked$(NC)"

##@ Publishing

npm-check: ## Check if package name is available
	@echo "$(BLUE)Checking package name availability...$(NC)"
	@npm view cepheid 2>&1 | grep -q "404" && \
		echo "$(GREEN)✓ Package name 'cepheid' is available$(NC)" || \
		echo "$(RED)✗ Package name 'cepheid' is already taken$(NC)"

npm-login: ## Login to npm
	@echo "$(BLUE)Logging into npm...$(NC)"
	npm login
	@echo "$(GREEN)✓ Logged in as $$(npm whoami)$(NC)"

pack: build ## Create tarball (dry-run of publish)
	@echo "$(BLUE)Creating package tarball...$(NC)"
	npm pack
	@echo "$(GREEN)✓ Tarball created$(NC)"
	@ls -lh cepheid-*.tgz

inspect: pack ## Inspect package contents
	@echo "$(BLUE)Inspecting package contents...$(NC)"
	tar -tzf cepheid-*.tgz | head -20
	@echo "$(YELLOW)...$(NC)"
	@echo "$(GREEN)Total files: $$(tar -tzf cepheid-*.tgz | wc -l | tr -d ' ')$(NC)"

publish-dry: build ## Dry-run publish (show what would be published)
	@echo "$(BLUE)Dry-run publish...$(NC)"
	npm publish --dry-run

publish: build npm-whoami ## Publish to npm (requires login)
	@echo "$(YELLOW)⚠️  Publishing to npm as $$(npm whoami)$(NC)"
	@echo "$(YELLOW)Press Ctrl+C to cancel, or Enter to continue...$(NC)"
	@read dummy
	@echo "$(BLUE)Publishing...$(NC)"
	npm publish
	@echo "$(GREEN)✓ Published successfully!$(NC)"
	@echo "$(GREEN)View at: https://www.npmjs.com/package/cepheid$(NC)"

publish-scoped: build npm-whoami ## Publish as scoped package (@username/cepheid)
	@echo "$(YELLOW)⚠️  Publishing scoped package as $$(npm whoami)$(NC)"
	@echo "$(YELLOW)Press Ctrl+C to cancel, or Enter to continue...$(NC)"
	@read dummy
	@echo "$(BLUE)Publishing with public access...$(NC)"
	npm publish --access public
	@echo "$(GREEN)✓ Published successfully!$(NC)"

npm-whoami: ## Check npm login status
	@npm whoami > /dev/null 2>&1 || (echo "$(RED)✗ Not logged into npm. Run: make npm-login$(NC)" && exit 1)

##@ Versioning

version-patch: ## Bump patch version (0.1.0 -> 0.1.1)
	@echo "$(BLUE)Bumping patch version...$(NC)"
	npm version patch
	@echo "$(GREEN)✓ Version bumped to $$(node -p "require('./package.json').version")$(NC)"

version-minor: ## Bump minor version (0.1.0 -> 0.2.0)
	@echo "$(BLUE)Bumping minor version...$(NC)"
	npm version minor
	@echo "$(GREEN)✓ Version bumped to $$(node -p "require('./package.json').version")$(NC)"

version-major: ## Bump major version (0.1.0 -> 1.0.0)
	@echo "$(BLUE)Bumping major version...$(NC)"
	npm version major
	@echo "$(GREEN)✓ Version bumped to $$(node -p "require('./package.json').version")$(NC)"

##@ Git Operations

git-setup: ## Set up git remote (if not already set)
	@echo "$(BLUE)Setting up git remote...$(NC)"
	@git remote get-url origin > /dev/null 2>&1 || \
		(git remote add origin https://github.com/g7tianyi/cepheid.git && \
		echo "$(GREEN)✓ Git remote added$(NC)") || \
		echo "$(YELLOW)Git remote already exists$(NC)"

git-push: ## Push to GitHub with tags
	@echo "$(BLUE)Pushing to GitHub...$(NC)"
	git push
	git push --tags
	@echo "$(GREEN)✓ Pushed to GitHub$(NC)"

git-status: ## Show git status
	@git status

##@ Complete Workflows

all: clean install build test ## Full build pipeline
	@echo "$(GREEN)✓ All tasks completed successfully$(NC)"

release-patch: version-patch git-push publish ## Release new patch version
	@echo "$(GREEN)✓ Patch release complete!$(NC)"

release-minor: version-minor git-push publish ## Release new minor version
	@echo "$(GREEN)✓ Minor release complete!$(NC)"

release-major: version-major git-push publish ## Release new major version
	@echo "$(GREEN)✓ Major release complete!$(NC)"

first-publish: git-setup all npm-check npm-login publish git-push ## Complete first-time publish workflow
	@echo "$(GREEN)✓ First publish complete!$(NC)"
	@echo "$(GREEN)Package available at: https://www.npmjs.com/package/cepheid$(NC)"

##@ Information

info: ## Show package information
	@echo "$(BLUE)Package Information:$(NC)"
	@echo "  Name:    $$(node -p "require('./package.json').name")"
	@echo "  Version: $$(node -p "require('./package.json').version")"
	@echo "  License: $$(node -p "require('./package.json').license")"
	@echo ""
	@echo "$(BLUE)Build Status:$(NC)"
	@[ -d "dist" ] && echo "  $(GREEN)✓ Built$(NC)" || echo "  $(RED)✗ Not built$(NC)"
	@[ -d "node_modules" ] && echo "  $(GREEN)✓ Dependencies installed$(NC)" || echo "  $(RED)✗ Dependencies not installed$(NC)"
	@echo ""
	@echo "$(BLUE)NPM Status:$(NC)"
	@npm whoami > /dev/null 2>&1 && echo "  $(GREEN)✓ Logged in as $$(npm whoami)$(NC)" || echo "  $(YELLOW)○ Not logged in$(NC)"

stats: ## Show package statistics
	@echo "$(BLUE)Package Statistics:$(NC)"
	@echo "  Source files: $$(find src -name '*.ts' | wc -l | tr -d ' ')"
	@echo "  Skills: $$(find skills -name 'skill.yaml' | wc -l | tr -d ' ')"
	@echo "  Templates: $$(find templates -name '*.yaml' | wc -l | tr -d ' ')"
	@[ -d "dist" ] && echo "  Built files: $$(find dist -name '*.js' | wc -l | tr -d ' ')" || echo "  Built files: 0 (not built)"
	@[ -f "cepheid-*.tgz" ] && echo "  Package size: $$(ls -lh cepheid-*.tgz | awk '{print $$5}')" || echo "  Package size: N/A"
