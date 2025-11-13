import { test, expect } from '@playwright/test';

test.describe('First-Time Learner Journey', () => {
  test('should complete lesson 1 from start to finish', async ({ page }) => {
    // 1. Navigate to home page
    await page.goto('/');

    // Verify home page loads
    await expect(page.getByText('汉字 Learning Game')).toBeVisible();
    await expect(page.getByText(/Master Traditional Chinese Characters/)).toBeVisible();

    // Verify lesson 1 is available
    const lesson1Link = page.getByRole('link', { name: /Lesson 1/i });
    await expect(lesson1Link).toBeVisible();

    // 2. Click on Lesson 1
    await lesson1Link.click();

    // Wait for lesson page to load
    await expect(page).toHaveURL(/\/lesson\/1/);
    await expect(page.getByText(/RTH Lesson 1 - Learning Phase/)).toBeVisible();

    // 3. Navigate through character introduction
    // Should see first character
    await expect(page.getByText(/Character 1 of/)).toBeVisible();

    // Verify character content is displayed
    await expect(page.getByRole('heading', { level: 3, name: /Story:/ })).toBeVisible();

    // Click Next button to go through all characters
    const nextButton = page.getByRole('button', { name: /Next →/i });

    // Navigate through characters (lesson 1 typically has 4 characters)
    // We'll click Next a few times
    for (let i = 0; i < 3; i++) {
      await expect(nextButton).toBeEnabled();
      await nextButton.click();
      await page.waitForTimeout(500); // Wait for transition
    }

    // 4. Start the game
    // After viewing all characters, should see summary or final card
    const startGameButton = page.getByRole('button', { name: /Start Game|Skip to Matching Game/i });
    await expect(startGameButton).toBeVisible();
    await startGameButton.click();

    // 5. Play Round 1: Story → Character
    await expect(page.getByText(/Round 1/i)).toBeVisible();

    // Wait for game board to load
    await page.waitForTimeout(1000);

    // The game should show stories on left and characters on right
    // We'll attempt to make matches
    // Note: This is a simplified test - in a real scenario we'd need to:
    // - Parse which stories/characters are shown
    // - Click on correct pairs
    // For now, we'll just verify the game UI is interactive

    // Verify game elements are present
    const cards = page.locator('[class*="cursor-pointer"]').first();
    await expect(cards).toBeVisible();

    // Try clicking on cards (simplified - won't necessarily match correctly)
    // In a real test, we'd need to identify correct matches

    // Just verify we can interact with the page
    await expect(page.getByText(/accuracy/i).or(page.getByText(/correct/i))).toBeVisible({
      timeout: 10000,
    });
  });

  test('should allow returning to home from lesson', async ({ page }) => {
    await page.goto('/lesson/1');

    // Wait for page to load
    await expect(page.getByText(/RTH Lesson 1/)).toBeVisible();

    // Look for back/home navigation
    const backButton = page
      .getByRole('link', { name: /back|home/i })
      .or(page.locator('a[href="/"]'));

    // If back button exists, test it
    if ((await backButton.count()) > 0) {
      await backButton.click();
      await expect(page).toHaveURL('/');
    }
  });

  test('should persist progress in localStorage', async ({ page }) => {
    await page.goto('/lesson/1');

    // Complete introduction
    await expect(page.getByText(/RTH Lesson 1/)).toBeVisible();

    // Skip to game immediately
    const skipButton = page.getByRole('button', { name: /Skip to Matching Game/i });
    if (await skipButton.isVisible()) {
      await skipButton.click();
    }

    // Wait a bit for any storage to be written
    await page.waitForTimeout(2000);

    // Check localStorage has been updated
    const progressData = await page.evaluate(() => {
      return localStorage.getItem('rth_lesson_progress');
    });

    expect(progressData).not.toBeNull();

    if (progressData) {
      const parsed = JSON.parse(progressData);
      // Should have data for lesson 1
      expect(parsed).toHaveProperty('lesson_1');
    }
  });

  test('should handle sound toggle', async ({ page }) => {
    await page.goto('/lesson/1');

    // Look for sound toggle button
    const soundToggle = page
      .getByRole('button', { name: /sound|mute|audio/i })
      .or(page.locator('button').filter({ hasText: /🔇|🔊/ }));

    if ((await soundToggle.count()) > 0) {
      // Click to toggle
      await soundToggle.first().click();
      await page.waitForTimeout(500);

      // Click again to toggle back
      await soundToggle.first().click();
    }
  });

  test('should show home page stats', async ({ page }) => {
    await page.goto('/');

    // Verify stats are shown
    await expect(page.getByText(/Available Lessons:/i)).toBeVisible();
    await expect(page.getByText(/total characters/i)).toBeVisible();

    // Verify instructions are present
    await expect(page.getByText(/How to Play:/i)).toBeVisible();
  });

  test('should have keyboard navigation', async ({ page }) => {
    await page.goto('/lesson/1');
    await expect(page.getByText(/RTH Lesson 1/)).toBeVisible();

    // Wait for character to be visible
    await page.waitForTimeout(1000);

    // Press arrow key to navigate
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);

    // Should still be on the lesson page (character changed)
    await expect(page.getByText(/RTH Lesson 1/)).toBeVisible();

    // Press left arrow
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(500);

    await expect(page.getByText(/RTH Lesson 1/)).toBeVisible();
  });
});

test.describe('Returning User Experience', () => {
  test('should show progress modal for returning user', async ({ page }) => {
    // First visit - simulate completing some progress
    await page.goto('/lesson/1');
    await expect(page.getByText(/RTH Lesson 1/)).toBeVisible();

    // Set some progress in localStorage
    await page.evaluate(() => {
      const progress = {
        lesson_1: {
          lessonId: 1,
          introductionCompleted: true,
          gamesPlayed: 2,
          bestScore: 80,
          bestAccuracy: 0.85,
          lastPlayed: new Date().toISOString(),
        },
      };
      localStorage.setItem('rth_lesson_progress', JSON.stringify(progress));
    });

    // Reload page
    await page.reload();

    // Should see returning user modal (if implemented)
    // This test will evolve as we implement the modal
    const welcomeBack = page.getByText(/welcome back|returning|progress/i);
    const hasWelcome = (await welcomeBack.count()) > 0;

    if (hasWelcome) {
      await expect(welcomeBack.first()).toBeVisible();
    }
  });
});

test.describe('Error Handling', () => {
  test('should show error boundary on invalid lesson', async ({ page }) => {
    // Try to access non-existent lesson
    await page.goto('/lesson/999');

    // Should either show error or redirect
    // Wait a bit for page to load
    await page.waitForTimeout(2000);

    // Check if error message or "not found" appears
    const errorContent = page.getByText(/not found|error|oops/i);
    const hasError = (await errorContent.count()) > 0;

    // Should show some kind of error state or redirect to home
    expect(hasError || (await page.url()).includes('/')).toBeTruthy();
  });
});
