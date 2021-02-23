using System;
using System.Threading.Tasks;
using ConsoleApp1;
using NServiceBus;

namespace ConsoleApp2
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.Title = "Subscriber";

            var config = new EndpointConfiguration("IdentityEndPoint");
            config.SendFailedMessagesTo("IdentityErrors");
            config.EnableInstallers();

            var transport = config.UseTransport<RabbitMQTransport>();
            transport.ConnectionString("host=localhost;username=guest;password=guest");
            transport.UseConventionalRoutingTopology();

            try
            {
                var endpointInstance = await Endpoint.Start(config)
                    .ConfigureAwait(false);

                
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            Console.ReadKey();
        }
    }

    public class PersonHandler : IHandleMessages<Person>
    {
        public async Task Handle(Person message, IMessageHandlerContext context)
        {
            try
            {
                Console.WriteLine(message.ToString());
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
    }
}
