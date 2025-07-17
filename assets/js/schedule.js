// Simple Schedule Manager with Smart Caching
class ScheduleManager {
	constructor() {
		this.csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRPAQB2HOtRgCDr4v087QAZkn6Xspdxa7fBpdzruyQ2FG8lgBQifd3exztSFW3fq2XsCL1AeJum2YyZ/pub?gid=1459193844&single=true&output=csv';
		this.bioUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRPAQB2HOtRgCDr4v087QAZkn6Xspdxa7fBpdzruyQ2FG8lgBQifd3exztSFW3fq2XsCL1AeJum2YyZ/pub?gid=1680343115&single=true&output=csv';
		this.scheduleData = [];
		this.bioData = [];
		this.cachedData = null;
		this.cachedBioData = null;
		this.cacheTime = null;
		this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
		this.init();
	}
	
	init() {
		this.loadSchedule();
		this.setupModalEvents();
		this.addRefreshButton();
	}
	
	async loadSchedule(forceRefresh = false) {
		const scheduleContent = document.getElementById('scheduleContent');
		
		// Check if we can use cached data
		if (!forceRefresh && this.canUseCache()) {
			this.scheduleData = this.cachedData;
			this.bioData = this.cachedBioData;
			this.renderSchedule();
			this.showCacheStatus();
			return;
		}
		
		// Show loading state
		scheduleContent.innerHTML = '<div class="loading">Loading schedule...</div>';
		
		try {
			const response = await fetch(this.csvUrl);
			if (!response.ok) throw new Error('Failed to load schedule');
			
			const csvText = await response.text();
			this.scheduleData = this.parseCSV(csvText);
			
			// Fetch bio data
			const bioResponse = await fetch(this.bioUrl);
			if (!bioResponse.ok) throw new Error('Failed to load speaker bio data');
			
			const bioText = await bioResponse.text();
			this.bioData = this.parseCSV(bioText);
			
			// Cache the fresh data
			this.cachedData = this.scheduleData;
			this.cachedBioData = this.bioData;
			this.cacheTime = Date.now();
			
			this.renderSchedule();
			this.showCacheStatus();
		} catch (error) {
			console.error('Error loading schedule:', error);
			
			// Try to use cached data as fallback
			if (this.cachedData && this.cachedBioData) {
				this.scheduleData = this.cachedData;
				this.bioData = this.cachedBioData;
				this.renderSchedule();
				this.showNotice('⚠️ Showing cached schedule (connection issue)');
			} else {
				// No cache available, show error
				scheduleContent.innerHTML = '<div class="error">Unable to load schedule data. Please check your connection and try again.</div>';
			}
		}
	}
	
	canUseCache() {
		return this.cachedData && 
			   this.cachedBioData &&
			   this.cacheTime && 
			   (Date.now() - this.cacheTime) < this.CACHE_DURATION;
	}
	
	addRefreshButton() {
		// Button will be added with cache status at the bottom
	}
	
	showCacheStatus() {
		// Remove any existing status
		const existingStatus = document.querySelector('.cache-status');
		if (existingStatus) existingStatus.remove();
		
		if (this.cacheTime) {
			const minutesAgo = Math.floor((Date.now() - this.cacheTime) / 60000);
			const timeText = minutesAgo === 0 ? 'just now' : `${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`;
			
			const status = document.createElement('div');
			status.className = 'cache-status';
			status.innerHTML = `
				Schedule updated ${timeText}
				<button id="refreshBtn" class="refresh-btn" style="border: none;">refresh</button>
			`;
			document.getElementById('scheduleContent').appendChild(status);
			
			// Add click handler to refresh button
			document.getElementById('refreshBtn').addEventListener('click', () => {
				this.loadSchedule(true); // Force refresh
			});
		}
	}
	
	parseCSV(csvText) {
		const lines = csvText.trim().split('\n');
		const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
		
		return lines.slice(1).map(line => {
			const values = this.parseCSVLine(line);
			const row = {};
			headers.forEach((header, index) => {
				row[header] = values[index] ? values[index].trim().replace(/"/g, '') : '';
			});
			return row;
		}).filter(row => {
			// For schedule data, filter by Day and Time
			if (row.Day !== undefined && row.Time !== undefined) {
				return row.Day && row.Time;
			}
			// For bio data, filter by Full name
			if (row['Full name'] !== undefined) {
				return row['Full name'];
			}
			// Default: keep non-empty rows
			return Object.values(row).some(value => value && value.trim());
		});
	}
	
	parseCSVLine(line) {
		const result = [];
		let current = '';
		let inQuotes = false;
		
		for (const char of line) {
			if (char === '"') {
				inQuotes = !inQuotes;
			} else if (char === ',' && !inQuotes) {
				result.push(current);
				current = '';
			} else {
				current += char;
			}
		}
		result.push(current);
		return result;
	}
	
	getSpeakerInfo(speakerName) {
		if (!speakerName || !this.bioData) return null;
		
		// Find matching speaker by name (now using 'Full name' column)
		const speaker = this.bioData.find(row => 
			row['Full name'] && row['Full name'].toLowerCase().trim() === speakerName.toLowerCase().trim()
		);
		
		return speaker || null;
	}
	
	convertGoogleDriveUrl(url) {
		if (!url) return null;
		
		// Convert Google Drive sharing URLs to direct image URLs
		const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
		if (driveMatch) {
			const fileId = driveMatch[1];
			return `https://drive.google.com/uc?id=${fileId}`;
		}
		
		// Convert Google Drive open URLs
		const openMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
		if (openMatch) {
			const fileId = openMatch[1];
			return `https://drive.google.com/uc?id=${fileId}`;
		}
		
		return url;
	}
	
	loadSampleData() {
		// Sample data removed - only show error if real data fails
		this.scheduleData = [];
	}
	
	renderSchedule() {
		const scheduleContent = document.getElementById('scheduleContent');
		const days = [...new Set(this.scheduleData.map(row => row.Day))];
		
		let html = '';
		days.forEach(day => {
			const dayData = this.scheduleData.filter(row => row.Day === day);
			html += this.renderDay(day, dayData);
		});
		
		scheduleContent.innerHTML = html;
		this.attachClickEvents();
	}
	
	renderDay(day, dayData) {
		// Convert day format for display
		let displayDay = day;
		if (day === 'Day 1') {
			displayDay = 'Day 1: 10 September';
		} else if (day === 'Day 2') {
			displayDay = 'Day 2: 11 September';
		}
		
		let html = `<div class="day-header"><h2>${displayDay}</h2></div>`;
		html += '<div class="schedule-container"><table class="schedule-table">';
		html += `
			<thead>
				<tr>
					<th style="width: 120px;">Time</th>
					<th>Track 1</th>
					<th>Track 2</th>
					<th>Track 3</th>
				</tr>
			</thead>
			<tbody>
		`;
		
		dayData.forEach(row => {
			const timeSlot = this.formatTimeSlot(row.Time, row.Duration);
			html += `<tr><td class="time-slot">${timeSlot}</td>`;
			
			['Track1', 'Track2', 'Track3'].forEach(track => {
				const title = row[`${track} Title`];
				const speaker = row[`${track} Speaker`];
				
				if (title && title.trim()) {
					html += `
						<td class="talk-cell" data-title="${this.escapeHtml(title)}" data-speaker="${this.escapeHtml(speaker)}">
							<div class="talk-title">${this.escapeHtml(title)}</div>
							<div class="talk-speaker">${this.escapeHtml(speaker)}</div>
						</td>
					`;
				} else {
					html += '<td></td>';
				}
			});
			html += '</tr>';
		});
		
		html += '</tbody></table></div>';
		return html;
	}
	
	formatTimeSlot(startTime, duration) {
		const [hours, minutes] = startTime.split(':').map(Number);
		const startMinutes = hours * 60 + minutes;
		const endMinutes = startMinutes + (parseInt(duration) || 45);
		const endHours = Math.floor(endMinutes / 60);
		const endMins = endMinutes % 60;
		const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
		return `${startTime}-${endTime}`;
	}
	
	attachClickEvents() {
		document.querySelectorAll('.talk-cell[data-title]').forEach(cell => {
			cell.addEventListener('click', () => this.showModal(cell));
			cell.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					this.showModal(cell);
				}
			});
		});
	}
	
	showModal(cell) {
		const title = cell.dataset.title;
		const speaker = cell.dataset.speaker;
		
		// Get speaker info from bio data
		const speakerInfo = this.getSpeakerInfo(speaker);
		
		document.getElementById('modalTitle').textContent = title;
		
		// Build speaker name with pronouns if available
		let speakerDisplay = speaker;
		if (speakerInfo && speakerInfo['Pronouns']) {
			speakerDisplay += ` (${speakerInfo['Pronouns']})`;
		}
		document.getElementById('modalSpeaker').textContent = speakerDisplay;
		
		// Use actual abstract or fallback
		const abstract = speakerInfo && speakerInfo['Abstract'] ? 
			speakerInfo['Abstract'] : 
			`Talk: ${title}`;
		document.getElementById('modalAbstract').innerHTML = `<strong>Abstract:</strong> ${abstract}`;
		
		// Build bio section with all available info
		let bioHTML = '';
		
		// Bio
		if (speakerInfo && speakerInfo['Bio']) {
			bioHTML += `<strong>Bio:</strong> ${speakerInfo['Bio']}<br><br>`;
		}
		
		// Links section
		let linksHTML = '';
		if (speakerInfo && speakerInfo['Github']) {
			linksHTML += `<a href="${speakerInfo['Github']}" target="_blank">GitHub</a>`;
		}
		if (speakerInfo && speakerInfo['Social Link']) {
			if (linksHTML) linksHTML += ' | ';
			linksHTML += `<a href="${speakerInfo['Social Link']}" target="_blank">Social</a>`;
		}
		
		if (linksHTML) {
			bioHTML += `<strong>Links:</strong> ${linksHTML}`;
		}
		
		// Fallback if no bio info
		if (!bioHTML) {
			bioHTML = `<strong>Speaker:</strong> ${speaker}`;
		}
		
		document.getElementById('modalBio').innerHTML = bioHTML;
		
		// Use photo if available, otherwise default
		let photoSrc = 'csvconbologna.png'; // Default photo
		if (speakerInfo && speakerInfo['Photo']) {
			const convertedUrl = this.convertGoogleDriveUrl(speakerInfo['Photo']);
			if (convertedUrl) {
				photoSrc = convertedUrl;
			}
		}
		document.getElementById('modalSpeakerImage').src = photoSrc;
		
		const modal = document.getElementById('talkModal');
		modal.style.display = 'block';
		document.getElementById('modalTitle').focus();
	}
	
	hideModal() {
		document.getElementById('talkModal').style.display = 'none';
	}
	
	setupModalEvents() {
		// Close modal events
		document.querySelector('.close').addEventListener('click', () => this.hideModal());
		
		document.getElementById('talkModal').addEventListener('click', (e) => {
			if (e.target.id === 'talkModal') this.hideModal();
		});
		
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') this.hideModal();
		});
	}
	
	showNotice(message) {
		const notice = document.createElement('div');
		notice.style.cssText = 'background: rgba(255, 215, 0, 0.1); border: 1px solid #ffd700; color: #ffd700; padding: 0.5em; border-radius: 4px; margin: 1em 0; font-size: 0.9em; text-align: center;';
		notice.textContent = message;
		document.getElementById('scheduleContent').insertBefore(notice, document.getElementById('scheduleContent').firstChild);
	}
	
	escapeHtml(text) {
		if (!text) return '';
		const div = document.createElement('div');
		div.textContent = text;
		return div.innerHTML;
	}
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
	new ScheduleManager();
});