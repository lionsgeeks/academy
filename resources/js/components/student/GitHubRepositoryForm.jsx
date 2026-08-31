import { useState, useEffect } from 'react';
import { GitBranch, AlertCircle, CheckCircle, Loader } from 'lucide-react';

export default function GitHubRepositoryForm({ formData, setFormData, exercise }) {
    const [validating, setValidating] = useState(false);
    const [repoValid, setRepoValid] = useState(null);
    const [branchValid, setBranchValid] = useState(null);
    const [availableBranches, setAvailableBranches] = useState([]);
    const [branchQuery, setBranchQuery] = useState(formData.branch);
    const [showBranchSuggestions, setShowBranchSuggestions] = useState(false);

    // Validate repository URL
    useEffect(() => {
        if (!formData.repository_url) {
            setRepoValid(null);
            return;
        }

        const validateRepo = async () => {
            setValidating(true);
            try {
                // Basic URL validation
                const url = new URL(formData.repository_url);
                if (!url.hostname.includes('github.com')) {
                    setRepoValid(false);
                    setValidating(false);
                    return;
                }

                // Extract owner/repo from URL
                const parts = url.pathname.split('/').filter(p => p);
                if (parts.length < 2) {
                    setRepoValid(false);
                    setValidating(false);
                    return;
                }

                // Check if repo is accessible (simple check)
                const owner = parts[0];
                const repo = parts[1].replace('.git', '');
                
                // Simulate API check - in production this would call GitHub API
                setRepoValid(true);
                
                // Get available branches (mock data)
                setAvailableBranches(['main', 'develop', 'master', 'staging']);
            } catch (err) {
                setRepoValid(false);
            } finally {
                setValidating(false);
            }
        };

        const timer = setTimeout(validateRepo, 500);
        return () => clearTimeout(timer);
    }, [formData.repository_url]);

    // Validate branch name
    useEffect(() => {
        if (!formData.branch) {
            setBranchValid(null);
            return;
        }

        const validateBranch = async () => {
            setValidating(true);
            try {
                // Check if branch name matches expected format
                const hasStudentPrefix = formData.branch.startsWith('student-');
                setBranchValid(hasStudentPrefix);
            } finally {
                setValidating(false);
            }
        };

        const timer = setTimeout(validateBranch, 300);
        return () => clearTimeout(timer);
    }, [formData.branch]);

    const handleBranchSelect = (branch) => {
        setFormData({ ...formData, branch });
        setBranchQuery(branch);
        setShowBranchSuggestions(false);
    };

    const filteredBranches = availableBranches.filter(b =>
        b.toLowerCase().includes(branchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Repository URL */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Repository URL *
                </label>
                <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                        <input
                            type="url"
                            value={formData.repository_url}
                            onChange={(e) => setFormData({ ...formData, repository_url: e.target.value })}
                            placeholder="https://github.com/your-username/your-repo"
                            className={`w-full px-4 py-2 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 transition-colors ${
                                repoValid === null
                                    ? 'border-gray-300 focus:ring-blue-500'
                                    : repoValid
                                    ? 'border-green-400 focus:ring-green-500'
                                    : 'border-red-400 focus:ring-red-500'
                            }`}
                        />
                        <div className="absolute right-3 top-2.5">
                            {validating && <Loader className="w-5 h-5 text-blue-600 animate-spin" />}
                            {!validating && repoValid === true && (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                            {!validating && repoValid === false && (
                                <AlertCircle className="w-5 h-5 text-red-600" />
                            )}
                        </div>
                    </div>
                </div>
                {repoValid === false && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Must be a valid GitHub repository URL
                    </p>
                )}
                <p className="mt-2 text-sm text-gray-600">
                    Use the HTTPS URL of your GitHub repository (e.g., https://github.com/username/repo)
                </p>
            </div>

            {/* Branch */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Branch Name *
                </label>
                <div className="relative">
                    <div className="flex items-center gap-2">
                        <GitBranch className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        <input
                            type="text"
                            value={branchQuery}
                            onChange={(e) => {
                                setBranchQuery(e.target.value);
                                setFormData({ ...formData, branch: e.target.value });
                                setShowBranchSuggestions(true);
                            }}
                            onFocus={() => setShowBranchSuggestions(true)}
                            placeholder="student-your-solution"
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 transition-colors ${
                                branchValid === null
                                    ? 'border-gray-300 focus:ring-blue-500'
                                    : branchValid
                                    ? 'border-green-400 focus:ring-green-500'
                                    : 'border-red-400 focus:ring-red-500'
                            }`}
                        />
                        <div className="absolute right-3 top-2.5">
                            {validating && <Loader className="w-5 h-5 text-blue-600 animate-spin" />}
                            {!validating && branchValid === true && (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                            {!validating && branchValid === false && (
                                <AlertCircle className="w-5 h-5 text-red-600" />
                            )}
                        </div>
                    </div>

                    {/* Branch Suggestions */}
                    {showBranchSuggestions && filteredBranches.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            {filteredBranches.map((branch) => (
                                <button
                                    key={branch}
                                    type="button"
                                    onClick={() => handleBranchSelect(branch)}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg font-mono text-sm transition-colors"
                                >
                                    {branch}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                {branchValid === false && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Branch must start with 'student-' prefix
                    </p>
                )}
                <p className="mt-2 text-sm text-gray-600">
                    Branch name must start with <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold">student-</code> (e.g., student-blog-api-solution)
                </p>
            </div>

            {/* Help */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Quick Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Your repository must be public or you must grant access</li>
                    <li>✓ The branch you specify will be tested against the exercise tests</li>
                    <li>✓ Make sure your code is pushed to the branch before submitting</li>
                    <li>✓ Tests will run automatically and results appear within seconds</li>
                </ul>
            </div>
        </div>
    );
}
