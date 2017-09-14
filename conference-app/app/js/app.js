// replace these values with those generated in your TokBox Account
var apiKey = "45959522";
var sessionId = "2_MX40NTk1OTUyMn5-MTUwNTM5MDc1ODc1NH5RMFdKdUF6aTFqZnFyTElTT1BPd3lpVWR-fg";
var token = "T1==cGFydG5lcl9pZD00NTk1OTUyMiZzaWc9MmM2ODU0NzliNDhjNjllYjI3MGEyOGU1NzYxYTJkNjc0NzgxMWQ0MDpzZXNzaW9uX2lkPTJfTVg0ME5UazFPVFV5TW41LU1UVXdOVE01TURjMU9EYzFOSDVSTUZkS2RVRjZhVEZxWm5GeVRFbFRUMUJQZDNscFZXUi1mZyZjcmVhdGVfdGltZT0xNTA1MzkwNzg3Jm5vbmNlPTAuNzM4NjE3MTg5NzgxMDYyMSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTA1Mzk0NDA1JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9";

// Handling all of our errors here by alerting them
function handleError(error) {
    if (error) {
        alert(error.message);
    }
}

function initializeSession() {
    var session = OT.initSession(apiKey, sessionId);

    // Subscribe to a newly created stream

    // Create a publisher
    var publisher = OT.initPublisher('publisher', {
        insertMode: 'append',
        width: '100%',
        height: '100%'
    }, handleError);

    // Connect to the session
    session.connect(token, function (error) {
        // If the connection is successful, publish to the session
        if (error) {
            handleError(error);
        } else {
            session.publish(publisher, handleError);
        }
    });
}