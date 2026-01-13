class ReimCaseUpdateService {
  private reimcaseupdate: Record<string, any> = {};

  /**
   * Set a value in the case update object
   * @param key - The property name
   * @param value - The value to set
   */
  setCaseUpdateVal(key: string, value: any): void {
    this.reimcaseupdate[key] = value;
  }

  /**
   * Get a value from the case update object
   * @param key - The property name
   * @returns The value or undefined if not found
   */
  getCaseUpdateVal(key: string): any {
    return this.reimcaseupdate[key];
  }

  /**
   * Get all values
   */
  getAllValues(): Record<string, any> {
    return { ...this.reimcaseupdate };
  }

  /**
   * Update multiple values at once
   * @param updates - Object with key-value pairs
   */
  updateMultiple(updates: Record<string, any>): void {
    this.reimcaseupdate = {
      ...this.reimcaseupdate,
      ...updates,
    };
  }

  /**
   * Clear all values
   */
  clearAll(): void {
    this.reimcaseupdate = {};
  }

  /**
   * Check if a key exists
   */
  hasKey(key: string): boolean {
    return key in this.reimcaseupdate;
  }

  /**
   * Delete a specific key
   */
  deleteKey(key: string): void {
    delete this.reimcaseupdate[key];
  }

  /**
   * Get object size (number of properties)
   */
  getSize(): number {
    return Object.keys(this.reimcaseupdate).length;
  }
}

// Create singleton instance
export const caseUpdateService = new ReimCaseUpdateService();
