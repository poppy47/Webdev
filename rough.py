class Solution: 
    def prefixConnected(self, words, k): 
        prefixSet = set() 
        count = 0 
        for i in range(len(words)): 
            if len(words[i]) >= k : 
                prefix = words[i][0:k+1]
                for j in range(i+1, len(words)) : 
                    if prefix in words[j] and prefix not in prefixSet: 
                        count += 1 
                        prefixSet.add(prefix) 
        return count        