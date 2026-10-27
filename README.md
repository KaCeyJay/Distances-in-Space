Distances in Space

An interactive website that explores astronomical distances using unusual measuring units, such as bricks, bathtubs, and schnitzels.

Development Log

1. Semantic HTML Structure
--------------------------
Created the initial HTML document.
Added the main structural elements: header, main, and footer.
Implemented navigation links and accessible labels.

2. Hero Section and Visual Design
--------------------------
Created the hero section with the website title and introduction.
Added a space-themed color palette and starfield background.
Integrated an Earth image and a Saturn-inspired logo.

3. Animated Earth Glow
--------------------------
Added a CSS animation (intensity and timing) that periodically creates a blue glow around Earth.
Included support for reduced-motion preferences.

4. Footer and Information Pages
--------------------------
Designed the footer to match the header.
Planned separate views for About and AI Disclosure.
Decided to switch the central content dynamically while keeping the header and footer consistent.

5. Calculator Architecture
--------------------------
Designed the initial HTML structure for the Cosmic Distance Calculator.
Decided to separate astronomical data and measuring units from the user interface.
Planned JSON files for storing celestial objects and measurement units.
TypeScript will later load the data, populate the selection fields, and perform calculations.

6. "Did you know"? aside box
--------------------------
Defined the JSON data structures.
Each refresh (F5) shows another space fact

7. Git Settings
--------------------------
Alias and email configured
.gitignore created

8. Liftoff
--------------------------
First working prototype without Lighthouse check

9. Lighthouse check
--------------------------
Contrast of Calculate button led to 96 points.
Fix: Darker background blue of Calculate button -> 100 points

10. "About" functionality
--------------------------
Added functionality to switch between "About" link in header and also added "Home" link

11. "AI Disclosure"
--------------------------
Added functionality to switch between "Home" text and "AI Disclosure" text 