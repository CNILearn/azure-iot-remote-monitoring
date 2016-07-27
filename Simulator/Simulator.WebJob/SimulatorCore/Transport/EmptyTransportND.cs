﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Azure.Devices.Applications.RemoteMonitoring.Simulator.WebJob.SimulatorCore.Logging;
using Microsoft.Azure.Devices.Applications.RemoteMonitoring.Simulator.WebJob.SimulatorCore.Serialization;

namespace Microsoft.Azure.Devices.Applications.RemoteMonitoring.Simulator.WebJob.SimulatorCore.Transport
{
    public class EmptyTransportND : ITransportND
    {
        private readonly ILogger _logger;
        private readonly ISerialize _serializer;

        public EmptyTransportND(ILogger logger, ISerialize serializer)
        {
            _logger = logger;
            _serializer = serializer;
        }

        public void Open()
        {
            return;
        }

        public Task CloseAsync()
        {
            return Task.Run(() => { });
        }

        public async Task SendEventAsync(dynamic eventData)
        {
            var eventId = Guid.NewGuid();
            await SendEventAsync(eventId, eventData);
        }

        public async Task SendEventAsync(Guid eventId, dynamic eventData)
        {
            _logger.LogInfo("SendEventAsync called:");
            _logger.LogInfo("SendEventAsync: EventId: " + eventId.ToString());
            _logger.LogInfo("SendEventAsync: message: " + eventData.ToString());

            await Task.Run(() => { return; });
        }

        public async Task SendEventBatchAsync(IEnumerable<Client.Message> messages)
        {
            _logger.LogInfo("SendEventBatchAsync called");

            await Task.Run(() => { return; });
        }

        public async Task<DeserializableCommandND> ReceiveAsync()
        {
            _logger.LogInfo("ReceiveAsync: waiting...");
            return await Task.Run(() => new DeserializableCommandND(new Client.Message(), _serializer));
        }

        public async Task SignalAbandonedCommand(DeserializableCommandND command)
        {
            if (command == null)
            {
                throw new ArgumentNullException("command");
            }

            await Task.Run(() => { });
        }

        public async Task SignalCompletedCommand(DeserializableCommandND command)
        {
            if (command == null)
            {
                throw new ArgumentNullException("command");
            }

            await Task.Run(() => { });
        }

        public async Task SignalRejectedCommand(DeserializableCommandND command)
        {
            if (command == null)
            {
                throw new ArgumentNullException("command");
            }

            await Task.Run(() => { });
        }
    }
}